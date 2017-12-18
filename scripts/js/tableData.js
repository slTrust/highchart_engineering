function nameSpace(param){
	//用于形成自己的闭包    避免变量污染
	
	funcSpace[param]={
			tableData:function(data,containerId) {
				if(data.length==0){
					$(containerId).html('<h3 style="text-align:-center;padding:16px 0;margin:0;">暂无数据</h3>')
					return;
				}
				$(containerId).html("");					
			 	if (data.length > 0) {
					var head = '';
					$.each(data[0], function(i) {
						// 下钻ID不展示
						if(i != 'DRILL_ID'){
							head += '<th>' + i + '</th>';
						}
					});
					var body = '';
					$.each(data, function(i, item) {
						body += '<tr height="30px">';
						$.each(item, function(key, value) {
							// 下钻ID不展示
							if(key != 'DRILL_ID'){
								body += '<td nowrap>' + value + '</td>';
							}
						});
						body += '</tr>';
					});
					$(containerId).append(
									'<table border="1" bordercolor="#000000" align="center" class="table table-striped table-bordered table-hover" id="editable">'
									+ '<thead>' + head + '</thead>'
									+ '<tbody>' + body + '</tbody>'
									+ '</table>');
					//生产tableId
					var tableId = 'table_'+containerId.substring(1,containerId.length-1);
					//设置table的id
					$(containerId+' table').attr('id',tableId)
					// 数据呈现模块   传递生成表格的容器id
					var table = this.drowTable(tableId);
				}
			},
			drowTable:function(tableId) {
				var table = null;
				//根据传递的tableId初始化表格
				table = $('#'+tableId).DataTable({
					/*"aLengthMenu" : [10,20,50,100], //更改显示记录数选项 
		            "iDisplayLength" : 10, //默认显示的记录数 
		            "bPaginate" : true, //是否显示（应用）分页器 
*/					"sPaginationType" : "full_numbers",
					"order": [],//把默认的排序置空     order:[0,'asc']默认值是 第一列升序排列
					"oLanguage" : {
						"sLengthMenu" : "每页显示 _MENU_ 条记录",
						"sZeroRecords" : "抱歉， 没有找到",
						"sInfo" : "从 _START_ 到 _END_ /共 _TOTAL_ 条数据",
						"sInfoEmpty" : "没有数据",
						"sInfoFiltered" : "(从 _MAX_ 条数据中检索)",
						"sZeroRecords" : "没有检索到数据",
						"sSearch" : "过滤:",
						"oPaginate" : {
							"sFirst" : "首页",
							"sPrevious" : "前一页",
							"sNext" : "后一页",
							"sLast" : "尾页"
						}
					}
				});
				$('#table #editable_wrapper div.col-sm-12').css('overflow','auto');
				return table;
			}
	
	}
}
