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
                  errors[field] = `مقدار باید وارد شود`
                }
                break
              case 'number':
                if (rule.int === true && /^[\-\+]?[0-9]+$/.test(value) === false) {
                  errors[field] = `مقدار وارد شده باید عدد صحیح باشد`
                  break
                }
                if (/^[\-\+]?[0-9]*(\.)?[0-9]+$/.test(value) === false) {
                  errors[field] = `مقدار وارد شده باید عدد باشد`
                  break
                }
                if (rule.min !== undefined) {
                  if (value < rule.min) {
                    errors[field] = `مقدار وارد شده باید بیشتر یا مساوی با ${rule.min} باشد`
                    break
                  }
                }
                break
              case 'url':
                if (/^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})$/.test(value) === false) {
                    errors[field] = `لینک وارد شده معتبر نیست`
                }
                break
              case 'email':
                if (/^\S+@\S+\.\S+$/.test(value) === false) {
                    errors[field] = `آدرس ایمیل معتبر نیست`
                }
                break
              case 'unique':
                try {
                    const response = await validator.checkUnique({
                        model: rule.model,
                        conditions: rule.conditions,
                        exceptIds: rule.exceptIds === undefined ? [] : rule.exceptIds
                    })
                    if (response.data.result === false) {
                        errors[field] = `از قبل وجود دارد`
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