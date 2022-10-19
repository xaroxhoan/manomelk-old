import useService from "./service"

const useValidator = () => {
    const {validator} = useService()

    const validate = async (data, conditions) => {
        const errors = {}
        for (const field in conditions) {
          let value = data[field]
          value = value === undefined || value === null ? '' : value
          const rules = conditions[field]
          if (rules === undefined || rules.length <= 0) {
            continue
          }
          for (const rule of rules) {
            switch (rule.name) {
              case 'required':
                if (value.length <= 0) {
                  errors[field] = `${field} can not be empty`
                }
                break
              case 'number':
                if (rule.int === true && /^[\-\+]?[0-9]+$/.test(value) === false) {
                  errors[field] = `${field} can be only integer`
                  break
                }
                if (/^[\-\+]?[0-9]*(\.)?[0-9]+$/.test(value) === false) {
                  errors[field] = `${field} can be only number`
                  break
                }
                if (rule.min !== undefined) {
                  if (value < rule.min) {
                    errors[field] = `${field} should be greater than or equal to ${rule.min}`
                    break
                  }
                }
                break
              case 'url':
                if (/^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/.test(value) === false) {
                    errors[field] = `${field} should be a valid url`
                }
                break
              case 'email':
                if (/^\S+@\S+\.\S+$/.test(value) === false) {
                    errors[field] = `${field} should be a valid email address`
                }
                break
              case 'unique':
                try {
                    const response = await validator.checkUnique({
                        model: rule.model,
                        conditions: rule.conditions,
                        exceptIds: rule.exceptIds === undefined ? [] : rule.exceptIds
                    })
                    if (response.data.data === false) {
                        errors[field] = `${field} is already exists`
                    }
                } catch (e) {}
                break
            }
            if (errors[field] !== undefined) {
              break
            }
          }
        }
        return errors
    }
    return { validate }
}

export default useValidator