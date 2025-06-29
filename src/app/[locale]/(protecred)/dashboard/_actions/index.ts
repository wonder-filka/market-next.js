import yahooFinance from 'yahoo-finance2'

const symbols = ['^NDX', '^GSPC', '^DJI', 'BTC-USD', 'ETH-USD', 'GC=F', 'CL=F', 'COMT']

export async function getQuotes() {
  const today = new Date()
  const from = new Date()
  from.setDate(today.getDate() - 30)

  const result = await Promise.all(
    symbols.map(async (symbol) => {
      const history = await yahooFinance.historical(symbol, {
        period1: from.toISOString().split('T')[0],
        period2: today.toISOString().split('T')[0],
        interval: '1d',
      })

      return {
        symbol,
        name: symbol,
        price: history.at(-1)?.close ?? 0,
        change: (history.at(-1)?.close ?? 0) - (history.at(-2)?.close ?? 0),
        buy: history.at(-1)?.close ?? 0,
        sell: history.at(-1)?.close ?? 0,
        history: history.map((d) => ({
          time: d.date.toISOString().slice(5, 10),
          open: d.open,
          close: d.close,
          high: d.high,
          low: d.low,
          price: d.close,
        })),
      }
    })
  )

  return result
}
