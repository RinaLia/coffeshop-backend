const db = require('../config/db')

module.exports = {
  getOwnersCount: (data) => {
    const sql = `SELECT COUNT(*) as total FROM owners 
    WHERE name LIKE '%${data.search || ''}%'
    ORDER BY name ${parseInt(data.sort) ? 'DESC' : 'ASC'}`
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error).total)
        }
        resolve(results[0].total)
      })
    })
  },

  getOwnerByCondition: (data) => {
    const sql = 'SELECT * FROM owners WHERE ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results)
      })
    })
  },
  getAllOwners: (start, end, data) => {
    const sql = `SELECT * FROM owners 
    WHERE name LIKE '%${data.search || ''}% 
    ORDER BY name ${parseInt(data.sort) ? 'DESC' : 'ASC'} LIMIT ${end} OFFSET ${start}`
    return new Promise((resolve, reject) => {
      db.query(sql, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results)
      })
    })
  },
  createOwner: (data) => {
    const sql = 'INSERT INTO owners SET ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(true)
      })
    })
  },

  updateOwner: (data) => {
    const sql = 'UPDATE owners SET ? WHERE ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results.affectedRows)
      })
    })
  },

  deleteOwner: (data) => {
    const sql = 'DELETE FROM owners WHERE ?'
    return new Promise((resolve, reject) => {
      db.query(sql, data, (error, results) => {
        if (error) {
          reject(Error(error))
        }
        resolve(results.affectedRows)
      })
    })
  }
}
