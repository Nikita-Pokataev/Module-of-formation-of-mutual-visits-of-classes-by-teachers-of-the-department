const path = require("path");
const cron = require("node-cron"); //Модуль для работы со временем
const nodemailer = require("nodemailer");
const { Teacher, Timetable, Visit } = require("../models/models");
const ApiError = require("../error/ApiError");
const fs = require("fs");
const Excel = require("exceljs");

let monthSheets = [
  ["Sep", "Oct", "Nov", "Dec"],
  ["Feb", "Mar", "Apr", "May"],
];
let lessonsTimes = [
  "",
  "8.30",
  "10.10",
  "11.50",
  "13.50",
  "15.20",
  "16.50",
];

let month = new Date().getMonth();
let allMonths = [
  "",
  "Феврале",
  "Марте",
  "Апреле",
  "Мае",
  "",
  "",
  "",
  "Сентябре",
  "Октябре",
  "Ноябре",
  "Декабре",
];

//transporter для почты
let transporter = nodemailer.createTransport({
  pool: true,
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const recognizeDate = (date) => {
  let splitDate = date.split(" ");
  let semester;
  if (splitDate[1] == "Sep") {
    semester = 0;
  } else {
    semester = 1;
  }
  let year = Number(splitDate[3]);
  return [semester, year];
};

//Генератор взаимопосещений
const generateAllVisits = async (teachers, timetable, semester, year) => {
  //semester: 0 - осенний, 1 - весенний
  let month = [8, 1];
  teachers.map(async (teacher) => {
    for (let visit = 0; visit < teacher.visits_number; visit++) {
      let nowDate = new Date(year, month[semester], 1); //Это 1 сентября или 1 февраля
      let lastDayOfSemester = new Date(year, month[semester] + 4, 2);
      let weekNumber = 1;
      let lessonsArr = [];
      let lastMonth = month[semester];
      //День недели семестра. Семестр начинается с нечётной недели. От этого и отталкиваемся. 1 Сентября - 35 неделя, 1 февраля - 5 неделя.
      //С помощью цикла for перебираем все дни месяца, добавляя в массив уроки, подходящие по условию дня недели и чётности. То же делаем и для остальных 3 месяцев. В условии for используем конструкцию date.getDay(),
      //к которой прибавляем по дню. Далее, новая итерация. Нужно придумать как определять чётность недели. Так же уроки для посещения не должны совпаать с теми, которые ведёт сам учитель.
      for (
        nowDate;
        nowDate < lastDayOfSemester;
        nowDate.setDate(nowDate.getDate() + 1)
      ) {
        //Праздники так же пропускаем

        if (lastMonth < nowDate.getMonth() || year < nowDate.getFullYear()) {
          //Если сменяется месяц, создаём записи в БД о текущем месяце и очищаем массив для возможных посещений следующего месяца
          let randomDigit = Math.floor(Math.random() * lessonsArr.length);
          //Создаём записи в БД
          await Visit.create({
            date: lessonsArr[randomDigit].date,
            teacherId: teacher.id,
            timetableId: lessonsArr[randomDigit].id,
          });
          lessonsArr = [];
        }
        let dayOfWeek = nowDate.getDay(); //Получаем номер дня недели
        if (dayOfWeek == 0) {
          //Если выпадает Воскресенье, меняем чётность числа недели и пропускаем текущую итерацию цикла
          weekNumber++;
          continue;
        }
        timetable.map(async (lesson) => {
          let weekParity = weekNumber % 2;
          if (
            lesson.week_day == dayOfWeek &&
            weekParity == lesson.week_type &&
            lesson.teacherId != teacher.id
          ) {
            lessonsArr.push({ id: lesson.id, date: nowDate.toDateString() });
          }
        });
        lastMonth = nowDate.getMonth();
      }
    }
  });
};

//Функция рассылки почты
const mailDistribution = async () => {
  const sendMails = (teachers) => {
    let maillist = [];
    teachers.map((teacher) => maillist.push(teacher.email));
    let msg = {
      from: process.env.SMTP_USER, // sender address
      subject: `Уведомление о взаимном посещении ${allMonths[month]}.`, // Subject line
      text: "",
      cc: "*******",
      to: maillist,
      html: `
                      <div>
                          В ${allMonths[month]} у вас запланировано одно или несколько взаимопосещений.
                      </div>
                  `,
    };
    transporter.sendMail(msg, (error) => {
      console.log(error);
    });
    //console.log("Email has been send");
  };

  const teachers = await Teacher.findAll();
  sendMails(teachers);
};

//Зупуск функции рассылки почты
//Рассылка проходит в полночь каждый первый день с Февраля по Май и с Сентября по Декабрь
cron.schedule(" 0 * 1 2,3,4,5-9,10,11,12 * ", async () => {
  mailDistribution();
});

class VisitsController {
  //Формирование ведомости в БД и в Exel
  async getStatement(req, res, next) {
    const { semester, year } = req.query;
    await Visit.destroy({ where: {}, truncate: true });
    const teachers = await Teacher.findAll(); //Массив пользователей
    const timetable = await Timetable.findAll();

    await generateAllVisits(teachers, timetable, semester, year);

    res.status(200).json({ message: "All done" });
  }

  async writeAndSendStatement(req, res, next) {
    //Создание и отправка Exel - ведомости
    try {
      let fileName = "statement.xlsx";
      let pathFile = path.resolve(__dirname, "..", "static", fileName);
      const teachers = await Teacher.findAll(); //Массив пользователей
      const timetable = await Timetable.findAll();
      const visits = await Visit.findAll();
      //Определяем семестр и год отчёта из БД
      let semesterAndYear = recognizeDate(visits[1].date); //Массив из семестра(0 - осенний, 1 - весенний), и даты
      //Удаление старой ведомости
      fs.unlink(pathFile, (err) => {
        console.log(err);
      });
      //Создание Exel
      const options = {
        filename: pathFile,
        useStyles: true,
        useSharedStrings: true,
      };
      const workbook = new Excel.stream.xlsx.WorkbookWriter(options);
      monthSheets[semesterAndYear[0]].map(async (monthSheet) => {
        //Получаем фамилии учителей
        const columns = [{ header: "", key: "fio", width: 15}]; //Ячейка A1 пуста
        const allRows = [];
        teachers.map(async (teacher) => {
          columns.push({ header: teacher.fio, key: teacher.id, width: 30 }); //Массив с первой строкой таблицы
          //Ищем id проверяющего учителя для вставки его в ключ, а также  в 1 ячейке строки вставляем фамилию проверяющего
          for (let visit = 0; visit < teacher.visits_number; visit++){
            timetable.map(async (lesson) => {
              if (teacher.id == lesson.teacherId){
                visits.map(async (visit) => {
                  let m = visit.date.split(" ");
                  if (lesson.id == visit.timetableId && m[1] === monthSheet){
                      allRows.push({fio: teacher.fio, [visit.teacherId]: lesson.lesson_name + "\n" + lesson.lesson_type + "\n" + visit.date + "\n" + lessonsTimes[lesson.lesson_time_number] + "\n" + lesson.cabinet})
                  }
                })
              }
            })
          }
        });

        //Создаём лист
        const worksheet = workbook.addWorksheet(monthSheet);
        //Колонки объявляются после ячеек
        worksheet.columns = columns;
        allRows.map(async (row) => {
            worksheet.addRow(row).commit();
        });

        worksheet.commit();
      });
      await workbook.commit();

      res.download(pathFile);
    } catch (e) {
      res.status(500).json({ message: "Ошибка скачивания" });
    }
  }

  async writeAndSendReport(req, res, next) {
    //Создание и отправка Exel - отчёта
    try {
      let fileName = "statement.xlsx";
      let pathFile = path.resolve(__dirname, "..", "static", fileName);
      const teachers = await Teacher.findAll(); //Массив пользователей
      const timetable = await Timetable.findAll();
      const visits = await Visit.findAll();
      //Определяем семестр и год отчёта из БД
      let semesterAndYear = recognizeDate(visits[1].date); //Массив из семестра(0 - осенний, 1 - весенний), и даты
      //Удаление старой ведомости
      fs.unlink(pathFile, (err) => {
        console.log(err);
      });
      //Создание Exel
      const options = {
        filename: pathFile,
        useStyles: true,
        useSharedStrings: true,
      };
      const workbook = new Excel.stream.xlsx.WorkbookWriter(options);
      monthSheets[semesterAndYear[0]].map(async (monthSheet) => {
        //Получаем фамилии учителей
        const columns = [{ header: "", key: "fio", width: 15}]; //Ячейка A1 пуста
        const allRows = [];
        teachers.map(async (teacher) => {
          columns.push({ header: teacher.fio, key: teacher.id, width: 30 }); //Массив с первой строкой таблицы
          //Ищем id проверяющего учителя для вставки его в ключ, а также  в 1 ячейке строки вставляем фамилию проверяющего
          for (let visit = 0; visit < teacher.visits_number; visit++){
            timetable.map(async (lesson) => {
              if (teacher.id == lesson.teacherId){
                visits.map(async (visit) => {
                  let m = visit.date.split(" ");
                  if (lesson.id == visit.timetableId && m[1] === monthSheet){
                    if (visit.checked){
                      allRows.push({fio: teacher.fio, [visit.teacherId]: "Посещение проведено\n" +  visit.date + "\nКомментарий преподавателя:\n"})
                    } else {
                      allRows.push({fio: teacher.fio, [visit.teacherId]: "Посещение не проведено\n" + "Дата пропуска: " + visit.date})
                    }
                      
                  }
                })
              }
            })
          }
        });

        //Создаём лист
        const worksheet = workbook.addWorksheet(monthSheet);
        //Колонки объявляются после ячеек
        worksheet.columns = columns;
        allRows.map(async (row) => {
            worksheet.addRow(row).commit();
        });

        worksheet.commit();
      });
      await workbook.commit();

      res.download(pathFile);
    } catch (e) {
      res.status(500).json({ message: "Ошибка скачивания" });
    }
  }

  async getVisits(req, res, next) {
    const { id } = req.query;
    const visits = await Visit.findAll({ where: { teacherId: id } });
    if (!visits) {
      next(ApiError.internal("Планируемые посещения не найдены"));
    }
    return res.json({ visits });
  }

  async setCheck(req, res, next) {
    const { visitId, dateOfCheck } = req.body;
    const { date } = await Visit.findOne({ where: { id: visitId } });
    //date на клиенте необходимо отсылать в виде строки в формате день, месяц, год
    if (dateOfCheck == date) {
      const newCheck = await Visit.update(
        { checked: true },
        { where: { id: visitId } }
      );
      return res.json({ newCheck });
    }
    next(
      ApiError.internal("Постановка отметки возможна только в день занятия")
    );
  }
}

module.exports = new VisitsController();
