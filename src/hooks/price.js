const usePrice = () => {
    const toPrice = (number) => {
        return parseFloat(number.toString()).toFixed(2)
    }
    return {
        toPrice
    }
}

export default usePrice