import {Notify} from "vant";

export const mobileReg = /^1[3456789]\d{9}$/;
export const pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
export const decimalReg = /^\d+(\.\d{0,2})?$/;
export const emailReg = /^([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;

/**
 * 时间补0
 *
 * @export
 * @param {*} val
 * @returns
 */
export function set2(val) {
  return val > 10 ? val : "0" + val;
}

/**
 * 时间格式化 'yyyy-MM-dd HH:mm:ss'
 *
 * @export
 * @param {Date} time 可选 时间
 * @param {Boolean} showTime 是否显示时间
 * @returns string
 */
export function timeFormat(time, showTime) {
  let date = time ? new Date(time) : new Date();
  let year = date.getFullYear();
  let month = set2(date.getMonth() + 1);
  let day = set2(date.getDate());
  let hour = set2(date.getHours());
  let minutes = set2(date.getMinutes());
  let seconds = set2(date.getSeconds());
  let str = `${year}-${month}-${day}`;
  str += (showTime ? ` ${hour}:${minutes}:${seconds}` : "");
  return str;
}

/**
 * 获取距离今天x天的时间
 *
 * @export
 * @param {Number} num 前/后几天
 * @param {Boolean} showTime 是否显示时间
 * @returns string
 */
export function getSomeFormatTime(num, showTime) {
  let date = new Date();
  date.setDate(date.getDate() + num);
  return timeFormat(date, showTime);
}

/**
 * 获取datePicker 时间
 *
 * @param {Number} num 相差的天数
 * @returns Array
 */
export function getDatePickerTime(num) {
  let arr = [];
  arr[0] = getSomeFormatTime(-num) + " 00:00:00";
  arr[1] = timeFormat() + " 23:59:59";
  return arr;
}

/**
 * 错误处理
 *
 * @export
 * @param {*} err
 * @param router
 */
export function handleError(err, router) {
  let errMsg = "系统错误";
  if (err && err.response && err.response.status === 401) {
    errMsg = err.response.data.errorMsg;
    Notify({
      message: errMsg,
      duration: 1500
    });
    setTimeout(() => {
      router.replace("/login");
    }, 1000);
    return false;
  }
  if (err && err.response && err.response.data.errorMsg) {
    errMsg = err.response.data.errorMsg;
  }
  Notify({
    message: errMsg,
    duration: 1500
  });
}

export function handleServerError(err, error, redirect) {
  if (err && err.response && err.response.status === 401) {
    redirect("/login");
  } else {
    error({statusCode: 500, message: "服务器开小差了"});
  }
}

/**
 * 去除空格
 *
 * @export
 * @param {*} str
 * @returns
 */
export function tirmAll(str) {
  return str.replace(/\s+/g, "");
}
