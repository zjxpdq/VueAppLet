import schema from 'async-validator'

class Validate {
  constructor (rules = {}) {
    this.__init(rules)
  }

  __init (rules) {
    this.validator = new schema(rules)
  }

  ext (data) {
    let type = 'success'
    this.validator.validate(data, (errors) => {
      if (errors) {
        type = 'error'
      } else {
        type = 'success'
      }
    })
    return type === 'success'
  }

  checkForm (data, toast) {
    return new Promise((resolve, reject) => {
      this.validator.validate(data).then(() => {
        resolve(true)
      }).catch(({ errors, fields }) => {
        console.log(fields)
        if (!toast) {
          wx.showToast({
            title: errors[0]['message'],
            icon: 'none',
            duration: 2000
          })
        } else {
          reject(errors)
        }
      })
    })
  }
}

export default Validate
