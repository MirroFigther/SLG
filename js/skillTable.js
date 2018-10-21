require('bootstrap');
require('table');
var skillTable = {
  // Employee:function(name, position, salary, office ){
  //   this.name = name;
  //   this.position = position;
  //   this.salary = salary;
  //   this._office = office;
  //   this.office = function() {
  //       returnthis._office;
  //   }
  // },
  init:function(){
     $("#skillTable").bootstrapTable({
         idField: "id",
         showRefresh: false,
         clickToSelect: true,
         data:[],
         columns: [
              {
                 field: "options",
                 title: "选项",
             }],
     });

     $('#skillTable').DataTable( {
         data: [
             new Employee( "Tiger Nixon", "System Architect", "$3,120", "Edinburgh"),
             new Employee( "Garrett Winters", "Director", "$5,300", "Edinburgh")
         ],
         columns: [
             { data: 'name'},
             { data: 'salary'},
             { data: 'office'},
             { data: 'position'}
         ]
     } );
   }
}
module.exports =skillTable;
