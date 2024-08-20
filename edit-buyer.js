
submitEditBuyerData = (buyerId) => {
    let name = $('#edit-form').find('#buyer-name').val()
    let prevName = $('#edit-form').find('#buyer-prev-name').val()

    if(name === "") {
        dialog.showMessageBoxSync({
            title:'Alert',
            type:'info',
            message: 'Nama harus diisi'
        })
    } else {
        if(name === prevName) {
            executeEditBuyerData(buyerId)
        } else {
            let query = `select count(*) as count from buyers where name = '${name}'`
            db.all(query, (err, row) => {
                if(err) throw err
                let rowNumber = row[0].count
                if(rowNumber < 1) {
                    executeEditBuyerData(buyerId)
                } else {
                    let msg = `${name} sudah terdaftar, silahkan masukan nama lain.`
                    dialog.showMessageBoxSync({
                     title: 'Alert',
                     type: 'info',
                     message: msg 
                
                    })
                }
            })
        }
    }
}

executeEditBuyerData = (buyerId) => {
    let name = $('#edit-form').find('#buyer-name').val()
    let address = $('#edit-form').find('#buyer-address').val()
    let website = $('#edit-form').find('#buyer-website').val()
    let telpOne = $('#edit-form').find('#buyer-telp-one').val()
    let telpTwo = $('#edit-form').find('#buyer-telp-two').val()
    let email = $('#edit-form').find('#buyer-email').val()

    let query = `update buyers set name = '${name}', address ='${address}', website='${website}', telp_one = '${telpOne}', telp_two = '${telpTwo}', email 
    = '${email}' where id = ${buyerId}`
    db.run(query, err => {
        if(err) throw err
        ipcRenderer.send('update:success', doc_id)
    }) 
}
