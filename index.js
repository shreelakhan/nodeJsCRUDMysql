const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user : 'root',
    password : 'root@123',
    database : 'Employeedb',
    multipleStatements : true
});

mysqlConnection.connect((err) => {
    if(!err){
        console.log('Connection succesull!');
    }
    else
    {
        console.log('Connection failed'+ JSON.stringify(err, undefined, 2));
    
    }
});

app.listen(3000, ()=> console.log('Server running on port: 3000'));

//Get All employees record
app.get('/employees', (req, res) => {
    mysqlConnection.query('SELECT * FROM employee', (err, rows, fields) => {
        if(!err)
        {
            res.send(rows);
        }
        else
        {
            console.log(err);
        }
    })
});

//Get an employee
app.get('/employees/:id', (req, res) =>{
    mysqlConnection.query('SELECT * FROM employee WHERE empId = ?', [req.params.id], (err, rows, fields) =>{
        if(!err)
        {
            res.send(rows);
        }
        else
        {
            console.log(err);
        }
        
    })
});

//Delete an emloyee
app.delete('/employees/:id', (req, res) =>{
    mysqlConnection.query('DELETE FROM employee WHERE empId = ?', [req.params.id], (err, rows, fields) =>{
        if(!err)
        {
            res.send('Deleted Succesfully!');
        }
        else
        {
            console.log(err);
        }
        
    })
});

//Post request
app.post('/employees', (req, res) =>{

    let emp = req.body;

    var sql = "SET @empId = ?; SET @empName = ?; SET @empCode = ?; SET @salary = ?; \
    CALL EmployeeAddOrEdit(@empId, @empName, @empCode, @salary);";

    mysqlConnection.query(sql,[emp.empId, emp.empName, emp.empCode, emp.salary],(err, rows, fields) =>{
        if(!err)
        {
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted employee id :'+ element[0].empId);
            });
        }
        else
        {
            console.log(err);
        }
        
    })
});

//Update request
app.put('/update/employees', (req, res) =>{

    let emp = req.body;

    var sql = "SET @empId = ?; SET @empName = ?; SET @empCode = ?; SET @salary = ?; \
    CALL EmployeeAddOrEdit(@empId, @empName, @empCode, @salary);";

    mysqlConnection.query(sql,[emp.empId, emp.empName, emp.empCode, emp.salary],(err, rows, fields) =>{
        if(!err)
                res.send('Updated Succesfully');
        else
            console.log(err);
    })
});