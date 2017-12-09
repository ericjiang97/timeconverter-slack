const url = require('url')
const Moment = require('moment-timezone')


convert = (from, to, time) => {
  var fromTime = Moment.tz(Moment().format("DD/MM/YYYY") + time + ":00", "DD/MM/YYYY  hh:mm", from);
  var fromTimeDisplay = fromTime.clone().format("Do MMMM YYYY, h:mm a")
  const toTime = fromTime.tz(to).format("Do MMMM YYYY, h:mm a")
  
  return "The time in \n " + to + " is: " + toTime + 
    "\n when converted from " + from +  " is: " + fromTimeDisplay
  
}
module.exports = async request => {
  const query = url.parse(request.url, true).query
  const londonCodes = ["LON", "LONDON", "GMT"]
  const aestCodes = ["MELB", "MEL", "MELBOURNE", "SYD", "SYDNEY", "AEST"]

  console.log(query)
  if (!query.text) {
    const londonCurrentTime = new Moment().tz('Europe/London').format('Do MMMM YYYY, h:mm:ss a')
    const melbCurrentTIme = new Moment().tz('Australia/Melbourne').format('Do MMMM YYYY, h:mm:ss a')
    return "The current time in \n Melbourne/Sydney (AEST) is: " + melbCurrentTIme + "\n London (GMT) is: " + londonCurrentTime
  }
  
  
  // console.log("QUERY DETECTED")
  const commands = query.text.split(" ")
  // console.log(commands)
  const location = commands[0].toUpperCase()
  if(commands.length > 2){
    return "Error"
  }
  
  if(londonCodes.indexOf(location) > -1){
    
    try {
      const time = commands[1]
      const times = time.split(":")
      if(times.length != 2){
        return "Invalid Format"
      }
      return convert("Europe/London", "Australia/Melbourne", time)
    } catch (e) {
      throw new Error("An Error Has Occured ensure time is following format: hh:mm")
    }

  } else if (aestCodes.indexOf(location) > -1){
    try {
      const time = commands[1]
      const times = time.split(":")
      if(times.length != 2){
        return "Invalid Format"
      }
      return convert("Australia/Melbourne", "Europe/London", time)
    } catch (e) {
      throw new Error("An Error Has Occured ensure time is following format: hh:mm")
    }
    
  } else if(location === 'LIST'){
    return "List of codes are the following: \n London: \n" + londonCodes.map(loc => { return "- " + loc + "\n"}) +
     "\n Melbourne: \n:" + aestCodes
  }
  

  return "No data available. Please ensure list of codes is valid."
  
}