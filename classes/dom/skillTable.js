require('bootstrap');
require('table');
var skillTable = {
  init:function(){
     $("#skillTable").bootstrapTable({
         idField: "id",
         showRefresh: false,
         clickToSelect: true,
         data:[{'options':'fasdf'}],
         columns: [
              {
                 field: "options",
                 title: "选项",
             }],
     });
   } ,
   change:function(){
       $("#a").html("<b>Hello world!</b>");
   }
}
module.exports =skillTable;


//  $("#winResultTable").bootstrapTable('load',arr);
//
//  $("#winOptionTable").bootstrapTable({
//     idField: "id",
//     showRefresh: false,
//     clickToSelect: true,
//     // url: "/Editable/GetUsers",
//     data:[],
//     onCheck: function (row, $element) {
//         checkRow=row;
//     },
//     columns: [
//         {radio: true},
//         {
//             field: "options",
//             title: "选项",
//             editable: {
//                 type: 'text',
//                 title: '选项',
//                 validate: function (v) {
//                     if (!v) return '选项不能为空';
//                 }
//             }
//         }, {
//             field: "odds",
//             title: "倍率",
//             editable: {
//                 type: 'text',
//                 title: '倍率',
//                 validate: function (v) {
//                     if (isNaN(v)) return '倍率必须是数字';
//                     var age = parseInt(v);
//                     if (age < 0) return '倍率必须大于0';
//                 }
//             }
//         },{
//             field: "status",
//             title: "是否启用",
//             editable: {
//                 type: 'select',
//                 title: '是否启用',
//                 source:[{value:1,text:"否"},{value:2,text:"是"}]
//             }
//         },{
//             field: "showImage",width:110,
//             title: "图片展示",
//             formatter: function (value, row, index) {
//                 return '<img style="width:50px;height:50px" src="'+row.image+'"/>'
//             }
//         }, {
//             field: "image",
//             title: "国家图片",
//             formatter: function (value, row, index) {
//                 return value==undefined?null:value
//                 //  return '<div>'+value +' <img src='+value+' alt="pic" /></div>'
//             },
//             editable: {
//                 type: 'text',
//                 title: '国家图片',
//                 validate: function (v) {
//                     if (!checkUrl(v)) return '请输入正确的链接';
//                 }
//             }
//         }], onEditableSave: function (field, row, oldValue, $el) {
//             if(field=='image') {
//                 var data=$("#winOptionTable").bootstrapTable('getData');
//                 $("#winOptionTable").bootstrapTable('load',data);
//             }
//         }
// });
