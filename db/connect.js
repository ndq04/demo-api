const mongoose = require('mongoose')

const connect = async (uri) => {
  try {
    await mongoose.connect(uri)
    console.log('Connect successfully!')
  } catch (err) {
    console.log('Connect failure!')
    console.log(err.message)
    process.exit(1)
  }
}

module.exports = {connect}
