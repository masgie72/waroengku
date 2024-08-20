submitEditPrdData = (rowId) => {
    let prdName = $('#edit-form').find('#editPrdName').val()
    let prevPrdName = $('#edit-form').find('#prevPrdName').val()
    let prdBarcode = $('#edit-form').find('#editPrdBarcode').val()
    let prevPrdBarcode = $('#edit-form').find('#prevPrdBarcode').val()
    let prdPrice = $('#edit-form').find('#editPrdPrice').val()

    if(prdName === "" || prdPrice === "") {
        dialog.showMessageBoxSync({
            title: 'Alert',
            type: 'info',
            message:'Nama produk dan harga harus diisi'
        })
    } else {
        if(prdName === prevPrdName) {
            if(prdBarcode === "" || prdBarcode === prevPrdBarcode) {
                executeEditPrdData(rowId)
            } else {
                let sql = `select count(*) as count from products where barcode = '${prdBarcode}'`
                db.all(sql, (err, row) => {
                    if(err) throw err
                    let rowNumber = row[0].count
                    if(rowNumber < 1) {
                        executeEditPrdData(rowId)
                    } else {
                        dialog.showMessageBoxSync({
                            title: 'Alert',
                            type: 'info',
                            message: "Barcode '" +prdBarcode+ "' sudah terdaftar didalam database."
                        })
                    }
                })
            }
        } else {
            let sql = `select count(*) as count from products where product_name = '${prdName}'` 
            db.all(sql, (err, result) => {
                if(err) {
                    console.log(err)
                } else {
                    let rowNumber =result[0].count
                    if(rowNumber < 1) {
                        if(prdBarcode === "" || prdBarcode === prevPrdBarcode) {
                            executeEditPrdData(rowId)
                        } else {
                            let sql = `select count(*) as count from products where barcode = '${prdBarcode}'`
                            db.all(sql, (err, row) => {
                                if(err) throw err
                                let rowNumber = row[0].count
                                if(rowNumber < 1) {
                                    executeEditPrdData(rowId)
                                } else {
                                    dialog.showMessageBoxSync({
                                        title: 'Alert',
                                        type: 'info',
                                        message: "Barcode `"+prdBarcode+ "` sudah terdaftar didalam database.",
                                    })
                                }
                            })
                        }
                    } else {
                        dialog.showMessageBoxSync({
                            title: 'Alert',
                            type: 'info',
                            message:  " Produk '" + prdName+ "'sudah terdaftar didalam database.",
                        })
                    }
                }
            })
        }
    }
}

executeEditPrdData = (rowId) => {
    let prdName = $('#edit-form').find('#editPrdName').val()
    let prdBarcode = $('#edit-form').find('#editPrdBarcode').val()
    let prdCategory = $('#edit-form').find('#editPrdCategory').val()
    let prdPrice = $('#edit-form').find('#editPrdPrice').val()
    let prdCost = $('#edit-form').find('#editPrdCost').val()
    let prdInitQty = $('#edit-form').find('#editPrdInitQty').val()
    let prdUnit = $('#edit-form').find('#editPrdUnit').val()

    if(prdPrice === "") {
        dialog.showMessageBoxSync({
            title: 'Alert',
            type: 'info',
            message: 'Harga jual harus diisi'
        })
    } else if(prdCost === "") {
        dialog.showMessageBoxSync({
        title: 'Alert',
        type: 'info',
        message: 'Harga pokok harus diisi'    
        })
    } else if(parseInt(prdPrice) < parseInt(prdCost)) {
        dialog.showMessageBoxSync({
            title: 'Alert',
            type: 'info',
            message: 'Harga jual berada dibawah harga pokok'
        })
    } else {
        let query = `update products set product_name ='${prdName}', barcode ='${prdBarcode}', category = '${prdCategory}', unit= '${prdUnit}', selling_price = '${prdPrice}', cost_of_product = '${prdCost}', product_initial_qty = '${prdInitQty}' where id = '${rowId}'`
        db.serialize( () => {
            db.run(query, err => {
                if(err) throw err
                ipcRenderer.send('update:success', doc_id)
            })
        })
    }
        
    }
