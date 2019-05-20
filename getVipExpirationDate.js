/**
 * 格式化日期
 * @param date
 * @param fmt
 * @returns {string}
 */
const dateFormat = (date, fmt = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) {
    return ''
  }
  if (typeof date === 'string') {
    date = new Date(date.replace(/-/g, '/'))
  }
  if (typeof date === 'number') {
    date = new Date(date)
  }
  let o = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  }
  let week = {
    '0': '\u65e5',
    '1': '\u4e00',
    '2': '\u4e8c',
    '3': '\u4e09',
    '4': '\u56db',
    '5': '\u4e94',
    '6': '\u516d'
  }
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '') + week[date.getDay() + ''])
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}


/**
 * 判断平闰年
 * @param year
 * @returns {number}  0为平 1为闰
 */
const judgeFlatOrLeapYear = year => {
  if (typeof year !== 'number') {
    return
  }
  if ((!(year % 4) && year % 100) || !(year % 400)) {
    return 1 // 闰年
  }
  return 0 // 平年
}

/**
 * 会员续费到期时间
 * @param date 当前到期时间
 * @param year 续费时长 单位年
 * @param month 续费时长 单位月
 * @param day 续费时长 单位日
 * @returns {string} 到期时间 YYYY-MM-DD HH:mm:ss
 */
const getFinalTimeStr = (date, { year = 0, month = 0, day = 0 }) => {
  if (!date) {
    return ''
  }
  if (typeof date === 'string') {
    date = new Date(date.replace(/-/g, '/'))
  }
  if (typeof date === 'number') {
    date = new Date(date)
  }

  let currentYear = date.getFullYear()
  let currentTimestamp = date.getTime()
  let currentMonth = date.getMonth() + 1

  const monthStandardDays = [
    [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
    [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  ]

  const oneDayTimestamp = 24 * 60 * 60 * 1000  // 一天的时间戳

  month += year * 12

  let arr = []
  let addYears = parseInt((month + currentMonth) / 12)

  // 根据新增时长 循环插入每年的每月天数
  for (let i = 0; i <= addYears; i++) {
    // 判断平闰年，根据平闰年 获取该年份的各月天数
    let currentYearStandardDays = monthStandardDays[judgeFlatOrLeapYear(currentYear + i)]
    arr = arr.concat(currentYearStandardDays)
  }

  let addMonthArr = arr.slice(currentMonth - 1, month)  // 截取新增月数的每月天数 用于计算天数

  // 获取最终时间戳
  let finalTimeStamp = currentTimestamp + (day + addMonthArr.reduce((prev, curr, idx, arr) => prev + curr)) * oneDayTimestamp


  return dateFormat(finalTimeStamp, 'YYYY-MM-DD HH:mm:ss')

}

console.log(getFinalTimeStr('2019-01-31 12:00:01', { year: 0, month: 1, day: 0 }))

