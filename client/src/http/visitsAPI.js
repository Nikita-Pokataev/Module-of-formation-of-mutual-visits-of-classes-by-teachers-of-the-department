import fileDownload from 'js-file-download';
// eslint-disable-next-line
import {$authHost, $host} from './index'

export const getPlan = async (semester, year) => {
    const {data} = await $authHost.get('api/visits/visits', {params: {semester: semester, year: year}});
    return data;
}

export const getVisits = async (id) => {
    const {data} = await $authHost.get('api/visits', {params: {id: id}});
    return data;
}

export const setCheck = async (visitId, dateOfCheck) => {
    const {data} = await $authHost.post('api/visits', {visitId, dateOfCheck});
    return data;
}

//2 запроса для скачивания отчёта и ведомости

export const downloadStatement = async () => {
    await $authHost.get('/api/visits/statement', {responseType: 'blob'}).then((response) => {
        fileDownload(response.data, 'statement.xlsx');
    })
    
}

export const downloadReport = async () => {
    await $authHost.get('/api/visits/report', {responseType: 'blob'}).then((response) => {
        fileDownload(response.data, 'report.xlsx');
    })
}

