const { Timetable } = require("../models/models");


class TimetableController {
  //Обновление расписания
  async updateTimetable(req, res, next) {
    //Не реализовано. Предпологается парсинг
    const timetable = await Timetable.destroy({ where: {}, truncate: true }); //Удаление старого расписания
    return res.json({ timetable });
  }
}

module.exports = new TimetableController();
