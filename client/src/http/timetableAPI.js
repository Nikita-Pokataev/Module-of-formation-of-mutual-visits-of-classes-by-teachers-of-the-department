// eslint-disable-next-line no-unused-vars
import {$authHost, $host} from './index'

export const updateTimetable = async () => {
    const {data} = await $authHost.get('api/timetable/timetable');
    return data;
}