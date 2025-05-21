import cron from 'node-cron'

cron.schedule('*/10 * * * * *', async () => {
  console.log('Executando tarefa todos os dias às 09:00')
})
