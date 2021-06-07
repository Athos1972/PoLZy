export const comparator = (order, isCurrentHeader) => {
  if (!isCurrentHeader) {
    return 'asc'
  }

  if (order === 'asc') {
    return 'desc'
  }

  return 'asc'
}

export const sortedData = (data, orderBy, ascOrder) => {
    const sortedData = [...data]

    if (orderBy === null) {
      return sortedData
    }

    sortedData.sort((a, b) => {
      const av = a[orderBy].toLowerCase()
      const bv = b[orderBy].toLowerCase()

      if (av > bv) {
        return ascOrder ? 1 : -1
      }

      if (av < bv) {
        return ascOrder ? -1 : 1
      }

      return 0
    })

    //console.log(sortedData)

    return sortedData
  }
