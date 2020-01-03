const forEachs = (arr, fn) => {
  if (!arr.length || !fn) {
    return
  }
  let i = -1
  let len = arr.length
  while (++i < len) {
    let item = arr[i]
    fn(item, i, arr)
  }
}

/**
 * 判断类型
 * @param obj
 * @return {*}
 */
const typeOf = obj => {
  const toString = Object.prototype.toString
  const map = {
    '[object Boolean]': 'boolean',
    '[object Number]': 'number',
    '[object String]': 'string',
    '[object Function]': 'function',
    '[object Array]': 'array',
    '[object Date]': 'date',
    '[object RegExp]': 'regExp',
    '[object Undefined]': 'undefined',
    '[object Null]': 'null',
    '[object Object]': 'object'
  }
  return map[toString.call(obj)]
}

const __getRules = () => {
  let rules = {}

  let val = {
    no1: {
      required: true,
      fields: {
        zip: []
      }
    },
    no2: [
      { required: true, msg: 'no2是必须的' },
      { type: 'number', max: 20, min: 0, msg: '农不能大于20或小于0' }
    ],
    no3: [
      { required: true, msg: 'no3是必须的' },
      { type: 'array', min: 2, msg: '农不能大于20或小于0' }
    ]
  }

  let obj = {}
  forEachs(Object.keys(val), item => {
    let value = val[item]

    switch (typeOf(value)) {
      case 'object':
        Object.assign(obj, value)
        if (value['fields']) {
          obj.fields = __getRules(value.fields)
        }
        rules[item] = obj
        break
      case 'array':
        break
      default:

    }


    if (typeOf(val[item]) === 'object') {


      /* rules[item] = {
        required: val[item]['required'],
        msg: val[item]['required'] ? val[item]['messages'] || '这是必填字段' : null
      } */
      /* if (val[item]['fields']) {

      } */
    }
  })
  console.log(rules)
}


class Validate {
  constructor (rules = {}) {
    Object.assign(this, { rules })
    this.__init()
  }


  __init () {
    this.__initMethods()
    this.__initData()
  }

  __initMethods () {
    let that = this
    this.methods = {
      /**
       * 验证必填元素
       */
      required (value, param) {
        if (!that.depend(param)) {
          return 'dependency-mismatch'
        } else if (typeof value === 'number') {
          value = value.toString()
        } else if (typeof value === 'boolean') {
          return !0
        }

        return value.length > 0
      },
      /* 验证电子邮箱格式 */
      email (value) {
        return that.optional(value) ||
          /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
            value)
      },
      /* 验证手机格式 */
      tel (value) {
        return that.optional(value) ||
          /^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$$/.test(
            value)
      },
      /* 验证密码 */
      password (value) {
        return that.optional(value) || /^[a-zA-Z\d]{6,16}$/.test(value)
      },
      /* 验证支付密码 */
      cashPassword (value) {
        return that.optional(value) || /^\d{6}$/.test(value)
      },
      /**
       * 验证URL格式
       */
      url (value) {
        return that.optional(value) ||
          /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
            value)
      },
      /**
       * 验证日期格式
       */
      date (value) {
        return that.optional(value) ||
          !/Invalid|NaN/.test(new Date(value).toString())
      },
      /**
       * 验证ISO类型的日期格式
       */
      dateISO (value) {
        return that.optional(value) ||
          /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(
            value)
      },
      /**
       * 验证十进制数字
       */
      number (value) {
        return that.optional(value) ||
          /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)
      },
      money (value) {
        return that.optional(value) ||
          /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/.test(
            value)
      },
      /**
       * 验证整数
       */
      digits (value) {
        return that.optional(value) || /^\d+$/.test(value)
      },
      /**
       * 验证身份证号码
       */
      idcard (value) {
        return that.optional(value) ||
          /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(
            value)
      },
      /** 验证车牌号 */
      license (value) {
        return that.optional(value) ||
          /(^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$)/.test(
            value)
      },
      intType (value) {
        return that.optional(value) || /^([1-9]|10)$/.test(value)
      },
      weight (value) {
        return that.optional(value) ||
          /^(\d|[1-9]\d|99)(\.\d{1,2})?$/.test(value)
      },
      /**
       * 验证两个输入框的内容是否相同
       */
      equalTo (value, param) {
        return that.optional(value) || value === that.data[param]
      },
      /**
       * 验证是否包含某个值
       */
      contains (value, param) {
        return that.optional(value) || value.indexOf(param) >= 0
      },
      /**
       * 验证最小长度
       */
      minlength (value, param) {
        return that.optional(value) || value.length >= param
      },
      /**
       * 验证最大长度
       */
      maxlength (value, param) {
        return that.optional(value) || value.length <= param
      },
      /**
       * 验证一个长度范围[min, max]
       */
      rangelength (value, param) {
        return that.optional(value) ||
          (value.length >= param[0] && value.length <= param[1])
      },
      /**
       * 验证最小值
       */
      min (value, param) {
        return that.optional(value) || value >= param
      },
      /**
       * 验证最大值
       */
      max (value, param) {
        return that.optional(value) || value <= param
      },
      /**
       * 验证一个值范围[min, max]
       */
      range (value, param) {
        return that.optional(value) || (value >= param[0] && value <= param[1])
      }
    }
  }

  /**
   * 初始化默认提示信息
   */
  __initDefaults () {
    this.defaults = {
      messages: {
        required: '这是必填字段',
        email: '请输入有效的电子邮件地址。',
        tel: '请输入11位的手机号码',
        password: '请输入正确的密码',
        cashPassword: '请输入正确的支付密码',
        url: '请输入有效的网址',
        date: '请输入有效的日期',
        dateISO: '请输入有效的日期（ISO），例如：2009-06-23，1998/01/22',
        number: '请输入有效的数字',
        money: '请输入正确的金额',
        digits: '只能输入数字',
        license: '请输入有效的车牌号',
        idCard: '请输入18位的有效身份证',
        intType: '请输入10以内',
        weight: '请填写100以内整数或两位小数',
        equalTo: this.formatTpl('输入值必须和 {0} 相同'),
        contains: this.formatTpl('输入值必须包含 {0}'),
        minlength: this.formatTpl('最少要输入 {0} 个字符'),
        maxlength: this.formatTpl('最多可以输入 {0} 个字符'),
        rangeLength: this.formatTpl('请输入长度在 {0} 到 {1} 之间的字符'),
        min: this.formatTpl('请输入不小于 {0} 的数值'),
        max: this.formatTpl('请输入不大于 {0} 的数值'),
        range: this.formatTpl('请输入范围在 {0} 到 {1} 之间的数值')
      }
    }
  }

  __initData () {
    this.errorList = []
  }

  /**
   * 格式化提示信息模板
   */
  formatTpl (source, params) {
    const that = this
    if (arguments.length === 1) {
      return function () {
        let args = Array.from(arguments)
        args.unshift(source)
        return that.formatTpl.apply(this, args)
      }
    }
    if (params === undefined) {
      return source
    }
    if (arguments.length > 2 && params.constructor !== Array) {
      params = Array.from(arguments).slice(1)
    }
    if (params.constructor !== Array) {
      params = [params]
    }
    params.forEach(function (n, i) {
      source = source.replace(new RegExp('\\{' + i + '\\}', 'g'), function () {
        return n
      })
    })
    return source
  }

  /**
   * 判断规则依赖是否存在
   */
  depend (param) {
    switch (typeof param) {
      case 'boolean':
        param = param
        break
      case 'string':
        param = Boolean(param.length)
        break
      case 'function':
        param = param()
      default:
        param = !0
    }
    return param
  }

  /**
   * 判断输入值是否为空
   */
  optional (value) {
    return !this.methods.required(value) && 'dependency-mismatch'
  }

  checkForm (data) {
    console.log(data)
  }
}

export default Validate
