import axios from 'axios'


describe('au-kabu', () => {
  test("auth", async () => {
    await axios.post('http://192.168.10.14:18081/kabusapi/token', {
      APIPassword: 'hogehoge'
    })
  })
})
