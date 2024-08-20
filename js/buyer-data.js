
totalBuyerPage = (total_row_displayed, searchVal) => {
    let query
    if(searchVal != "") {
        query = `select count(*) as total_row from buyers where name like '%${searchVal}%' escape '!' or address like '%${searchVal}%' escape '!' or website like '%${searchVal}%' escape '!' or
        telp_one like '%${searchVal}%' escape '!' or telp_two like '%${searchVal}%' escape '!' or email like '%${searchVal}%' escape '!'`
        } else {
            query = `select count(*) as total_row from buyers`
        }
    
    db.serialize( () => {
        db.each(query, (err, result) => {
            if(err) throw err
            let total_page
            if(result.total_row%total_row_displayed == 0) {
                total_page = parseInt(result.total_row)/parseInt(total_row_displayed)
            } else {
                total_page = parseInt(result.total_row/total_row_displayed)+1
            }
            $('#total_pages').val(total_page)
        })
    })
    }
    function loadBuyer(page_number, total_row_displayed, searchVal) {
        let row_number 
        if(page_number < 2) {
            row_number = 0
        } else {
            row_number = (page_number-1)*total_row_displayed
        }
        total_page(total_row_displayed, searchVal)
    
        let query
        if(searchVal != "") {
          query = `select * from buyers where name like '%${searchVal}%' escape '!' or address like '%${searchVal}' escape '!' or website like '%${searchVal}' escape '!' or telp_one like '%${searchVal}' escape '!' or telp_two like '%${searchVal}' escape '!' or email like '%${searchVal}' escape '!' order by id desc limit ${row_number}, ${total_row_displayed}`
        } else {
            query = `select * from buyers order by id desc limit ${row_number}, ${total_row_displayed}`
        }
        db.serialize( () => {
            db.all(query, (err, rows) => {
                if (err) throw err
                let tr = ''
                if(rows.length < 1) {
                    tr += ''
                } else {
                    rows.forEach((row) => {
                        tr+=`<tr data-id=${row.id}>
                          <td data-colname="Id">
                        ${row.id}
                        <input type="checkbox" style="visibility:hidden" id="${row.id}" class="data-checkbox">
                        </td>
                        <td>${row.name}</td>
                        <td>${row.address}</td>
                        <td>${row.website}</td>
                        <td>${row.telp_one}</td>
                        <td>${row.telp_two}</td>
                        <td>${row.email}</td>
                        <td>
                        <button class="btn btn-sm btn-warning" onclick="editRecord(${row.id})" id="edit-data"><i class="fa fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger" onclick="deleteAction(${row.id}, '${row.name}')" id="delete-data"><i class="fa fa-trash"></i></button>
                        </td>
                        </tr>`
                    })
                }
                $('tbody#data').html(tr)
            })
        })
    }
    

insertBuyer = () => {
    let name = $('#buyer-name').val()
    let address = $('#buyer-address').val()
    let website = $('#buyer-website').val()
    let telpOne = $('#buyer-telp-one').val()
    let telpTwo = $('#buyer-telp-two').val()
    let email = $('#buyer-email').val()

    let required = $('[required]')
    let required_array = []
    required.each(function() {
        if($(this).val() != "") {
            required_array.push($(this).val())
        }
    })

    if(required_array.length < 1) {
        dialog.showMessageBoxSync({
            title: 'Alert',
            type: 'info',
            message: 'Nama Buyer / Customer harus diisi'
        })
    } else {
        db.serialize( () => {
            db.each(`select count(*) as row_number from buyers where name = '${name}'`, (err, res) => {
                if(err) throw err
                if(res.row_number < 1) {
            db.run(`insert into buyers(name, address, website, telp_one, telp_two, email) values('${name}','${address}','${website}','${telpOne}','${telpTwo}','${email}')`, err => {
                if(err) throw err
                    $('#page_number').val(1)
                    $('.buyer-form').val("")
                    $('#buyer-name').focus()
                    let total_row_displayed = $('#row_per_page').val()
                    load_data(1, total_row_displayed)
                        })
                } else {
                    dialog.showMessageBoxSync({
                        title: 'Alert',
                        type: 'info',
                        message: 'Nama Buyer/Customer sudah ada dalam database, silahkan gunakan nama produk lain'
                    })
                }
            })
           
        })
    }
   
}

editBuyerData = (id) => {
    let query = `select * from buyers where id = ${id}`
    db.all(query, (err, result) => {
        if(err) throw err
        let row = result[0]
        editForm = `<div class="input-group mb-3">
        <span class="input-group-text"><i class="fa fa-user"></i></span>
        <input type="hidden" value="${row.name}" id="buyer-prev-name">
        <input type="text" class="form-control form-control-sm" value="${row.name}" placeholder="Nama" 
        id="buyer-name" required autofocus>
        </div>
        <div class="input-group mb-3">
        <span class="input-group-text"><i class="fa fa-address-book"></i></span>
        <input type="text" class="form-control form-control-sm" value="${row.address}" placeholder="Alamat" 
        id="buyer-address">
        </div>
         <div class="input-group mb-3">
        <span class="input-group-text"><i class="fa fa-globe"></i></span>
        <input type="text" class="form-control form-control-sm" value="${row.website}" placeholder="Website" 
        id="buyer-website">
        </div>
         <div class="input-group mb-3">
        <span class="input-group-text"><i class="fa fa-phone-square"></i></span>
        <input type="text" class="form-control form-control-sm" value="${row.telp_one}" placeholder="Telp 1" 
        id="buyer-telp-one">
        </div>
        <div class="input-group mb-3">
        <span class="input-group-text"><i class="fa fa-phone-square"></i></span>
        <input type="text" class="form-control form-control-sm" value="${row.telp_two}" placeholder="Telp 2" 
        id="buyer-telp-two">
        </div>
        <div class="input-group mb-3">
        <span class="input-group-text"><i class="fa fa-envelope"></i></span>
        <input type="text" class="form-control form-control-sm" value="${row.email}" placeholder="Email" 
        id="buyer-email">
        </div>
        <button class="btn btn-sm btn-primary" onclick="submitEditBuyerData(${id})"><i class="fa
        fa-paper-plane"></i> Submit</button>
        `
        ipcRenderer.send('load:edit', 'buyer-data', editForm, 300, 400, id)
    })
}

ipcRenderer.on('update:success', (e, msg) => {
    alertSuccess(msg)
    let pageNumber = $('#page_number').val()
    let totalRowDisplayed = $('#row_per_page').val()
    load_data(pageNumber, totalRowDisplayed)
})

exportCsvBuyerData = (filePath, ext, joinIds = false) => {
    let sql
    let file_path = filePath.replace(/\\/g,'/')
    if(joinIds) {
        sql = `select * from buyers where id IN(${joinIds}) order by id desc`
    } else {
        sql = `select * from buyers order by id desc`
    }

    db.all(sql, (err, result) => {
        if(err) throw err
        convertToCsv = (arr) => {
            let array = [Object.keys(arr[0])].concat(arr)
        return array.map( (item) => {
            return Object.values(item).toString()
        }).join('\r\n')
        }
        let content = convertToCsv(result)
        ipcRenderer.send('write:CSV', file_path, content)
    })
}

exportPdfBuyerData = (filePath, ext, joinIds = false) => {
    let file_path = filePath.replace(/\\/g,'/')
    let sql
    if(joinIds) {
        sql = `select * from buyers where id IN(${joinIds}) order by id desc`
        db.all(sql, (err, res) => {
            if(err) throw err
            let tbody = ''
            thead = `<tr>
            <th>Id</th>
            <th>Nama</th>
            <th>Alamat</th>
            <th>Website</th>
            <th>Telp 1</th>
            <th>Telp 2</th>
            <th>Email</th>
            </tr>
            `
            res.forEach( (row) => {
                tbody+=`<tr>
                <td>${row.id}</td>
                <td>${row.name}</td>
                <td>${row.address}</td>
                <td>${row.website}</td>
                <td>${row.telp_one}</td>
                <td>${row.telp_two}</td>
                <td>${row.email}</td>
                `
            })

            ipcRenderer.send('load:to-pdf', thead, tbody, file_path, 'buyer-data', 'Data Customer')
        })
    } else {
        sql = `select * from buyers order by id desc`
        db.all(sql, (err, res) => {
            if(err) throw err
            let tbody = ''
            thead = `<tr>
             <th>Id</th>
            <th>Nama</th>
            <th>Alamat</th>
            <th>Website</th>
            <th>Telp 1</th>
            <th>Telp 2</th>
            <th>Email</th>
            </tr>
            `
            res.forEach( (row) => {
                tbody+=`<tr>
                <td>${row.id}</td>
                <td>${row.name}</td>
                <td>${row.address}</td>
                <td>${row.website}</td>
                <td>${row.telp_one}</td>
                <td>${row.telp_two}</td>
                <td>${row.email}</td>
                `
            })

            ipcRenderer.send('load:to-pdf', thead, tbody, file_path, 'buyer-data', 'Data Customer')
        })
    }
}
