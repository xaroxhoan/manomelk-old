import * as moment from 'moment'

const useMoment = () => {

    const formatDate = (date) => {
        return moment(date).format('YYYY-MM-DD HH:mm:ss A')
    }

    return {
        moment,
        formatDate
    }
}

export default useMoment