const url = require('url')
const Moment = require('moment-timezone')

module.exports = async request => {
  const query = url.parse(request.url, true).query
  const londonCodes = ["LON", "LONDON", "GMT"]
  const aestCodes = ["MELB", "MELBOURNE", "SYD", "SYDNEY", "AEST"]

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
      var londonTime = Moment.tz(Moment().format("DD/MM/YYYY") + times, "DD/MM/YYYY  hh:ss", "Europe/London");
      var londDisplayTime = londonTime.clone().format("DD/MM/YYYY  hh:ss  A")
      const melbTime = londonTime.tz("Australia/Melbourne").format("DD/MM/YYYY  hh:ss  A")
     
      return "The time in \n Melbourne/Sydney (AEST) is: " + melbTime + "\n when converted from London (GMT) is: " + londDisplayTime

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
      var fromTime = Moment.tz(Moment().format("DD/MM/YYYY") + times, "DD/MM/YYYY  hh:ss", "Australia/Melbourne");
      var displayTime = fromTime.clone().format("DD/MM/YYYY  hh:ss  A")
      const convertedTime = fromTime.tz("Europe/London").format("DD/MM/YYYY  hh:ss  A")
     
      return "The time in \n London (GMT) is: " + convertedTime + "\n when converted from Melbourne/Sydney (AEST) is: " + displayTime

    } catch (e) {
      throw new Error("An Error Has Occured ensure time is following format: hh:mm")
    }
    
  }
  

  return "No data available"
  
}