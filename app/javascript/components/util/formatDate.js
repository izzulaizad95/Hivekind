export const formatDate = date => {
  const monthArr = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ]

  var d = new Date(date)
  date = [
    monthArr[d?.getMonth()],
    `${('0' + d.getDate()).slice(-2)},`,
    d.getFullYear(),
  ].join(' ')

  return date
}
