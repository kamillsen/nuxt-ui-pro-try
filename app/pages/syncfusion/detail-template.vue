<template>
  <div class="space-y-6">
    <!-- Sayfa Başlığı -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Detail Template Grid</h2>
      <UButton color="primary">
        <UIcon name="i-heroicons-plus" class="mr-2" />
        Add New
      </UButton>
    </div>

    <!-- Grid Tablosu Kartı -->
    <UCard>
      <!-- Kart Başlığı -->
      <template #header>
        <div class="flex items-center gap-2 w-full">
          <h3 class="text-lg font-semibold">Employee Management Grid</h3>
        </div>
      </template>

      <div class="col-lg-12 control-section">
        <div id="app">
          <ejs-grid ref="grid" :dataSource='employeeDataParent' height='600' width='auto' :detailDataBound='detailDataBound'
            :detailTemplate="'detailTemplate'" allowSorting="true" allowFiltering="true" :filterSettings='filterSettings'>
            <e-columns>
              <e-column headerText="Image" width="70"
                :template="'employeeImageTemplate'"></e-column>
              <e-column field="EmployeeID" headerText="ID" isPrimaryKey width="70"></e-column>
              <e-column field="Name" headerText="Name" width="70"></e-column>
              <e-column field="MailID" headerText="Email ID" width="120" :template="'mailIDTemplate'"></e-column>
              <e-column field="SoftwareTeam" headerText="Team(s)" width="70"></e-column>
              <e-column field="ReportTo" headerText="Reporter" width="70" ></e-column>
            </e-columns>
            <template v-slot:detailTemplate>
              <div>
                <p class="report"><b>Sprint</b></p>
                <ejs-tab ref="tabObj" id="tab">
                  <e-tabitems>
                    <e-tabitem :header='headerText0' :content="'taskTemplate'"></e-tabitem>
                    <template v-slot:taskTemplate>
                      <div>
                        <ejs-kanban id="kanban" cssClass="kanban-swimlane" keyField="Status" :dataSource='taskData' :cardSettings="cardSettings">
                          <e-kanbancolumns>
                            <e-kanbancolumn headerText="Open" keyField="Open"></e-kanbancolumn>
                            <e-kanbancolumn headerText="In Progress" keyField="InProgress"></e-kanbancolumn>
                            <e-kanbancolumn headerText="Testing" keyField="Testing"></e-kanbancolumn>
                            <e-kanbancolumn headerText="Done" keyField="Close"></e-kanbancolumn>
                          </e-kanbancolumns>
                        </ejs-kanban>
                      </div>
                    </template>
                    <e-tabitem :header='headerText1' :content="'chartTemplate'"></e-tabitem>
                    <template v-slot:chartTemplate>
                      <div>
                        <ejs-chart ref="chart" height='280px' :primaryXAxis="primaryXAxis"
                          title="Sales" :tooltip="tooltip">
                          <e-series-collection>
                            <e-series type='Line' :dataSource='salesData' xName='taskid' yName='estimatedHours' name='Estimated Hours'
                              :marker="markerOptions"></e-series>
                            <e-series type='Line' :dataSource='salesData' xName='taskid' yName='spentHours' name='Spent Hours'
                              :marker="markerOptions"></e-series>
                          </e-series-collection>
                        </ejs-chart>
                      </div>
                    </template>
                  </e-tabitems></ejs-tab>
              </div>
            </template>
            <template v-slot:employeeImageTemplate="{ data }">
              <div class="image">
                <img
                  :src="'https://ej2.syncfusion.com/vue/demos/src/grid/images/' + data.EmployeeID.replace('Emp100', '') + '.png'"
                  :alt="data.EmployeeID" />
              </div>
            </template>
            <template v-slot:mailIDTemplate="{ data }">
              <a :href="'mailto:' + data.MailID">{{ data.MailID }}</a>
            </template>
          </ejs-grid>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup>
import { provide, ref, createApp } from "vue";
import { GridComponent as EjsGrid, ColumnsDirective as EColumns, ColumnDirective as EColumn, DetailRow, Sort, Filter } from "@syncfusion/ej2-vue-grids";
import { TabComponent as EjsTab, TabItemsDirective as ETabitems, TabItemDirective as ETabitem } from "@syncfusion/ej2-vue-navigations";
import { ChartComponent as EjsChart, SeriesDirective as ESeries, SeriesCollectionDirective as ESeriesCollection, LineSeries, Legend, Tooltip, DateTime, Category, Highlight } from "@syncfusion/ej2-vue-charts";
import { employeeDetail, taskDetail } from './data-source';
import { KanbanComponent as EjsKanban, ColumnsDirective as EKanbancolumns, ColumnDirective as EKanbancolumn} from "@syncfusion/ej2-vue-kanban";

// Syncfusion dinamik tema yönetimi
useSyncfusionTheme()

const employeeDataParent = ref(employeeDetail);
const headerText0 = ref({ text: 'Taskboard' });
const headerText1 = ref({ text: 'Burndown Chart' });
const filterSettings = ref({ type: 'CheckBox' });
const tooltip = ref(true);
const markerOptions = ref({ visible: true, width: 10, height: 10 });
const primaryXAxis = ref({ valueType: 'Category', title: 'Status' });
const salesData = ref([]);
const taskData = ref([]);

const cardSettings = ref({
  headerField: "Id",
  template: function () {
    return { template: createApp({}).component('sortCardTemplate', {
      template: `<div className="card-template">
      <table className="card-template-wrap" style="width: 100%;">
        <tbody>
          <tr>
            <td className="e-title">
              <div className="e-card-header">
                <div className="e-card-header-caption">
                  <div className="e-card-header-title e-tooltip-text">
                    {{data.Id}}
                  </div>
                </div>
              </div>
              <table
                className="card-template-wrap">
                <tbody>
                  <tr className='e-tooltip-text'>
                    <td>
                      <div className="e-card-content">
                        {{data.Summary}}
                      </div>
                      <span className="e-card-content"><b>Estimated hour:</b> {{data.Estimate}}</span>
                    </td>

                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table >
    </div >`,
      data: function () {return {data: {data: {}}};}
    }) 
  };
  }
});

function detailDataBound(args) {
  const rowData = args.data;
  taskData.value = taskDetail.filter((task) => task.Assignee === rowData.Name);
  salesData.value = generateData(taskData.value);
}

function generateData(taskData) {
  const statusCategories = ['Open', 'InProgress', 'Testing', 'Close'];
  const statusData = statusCategories.map((status) => {
    const filteredTasks = taskData.filter((task) => task.Status === status);
    const estimatedHours = filteredTasks.reduce((sum, task) => sum + task.Estimate, 0);
    const spentHours = filteredTasks.reduce((sum, task) => sum + task.Spent, 0);
    let taskid = '';
    if (filteredTasks.length) {
      taskid = filteredTasks[0].Id;
    }
    return { spentHours, estimatedHours, status, taskid };
  });
  return statusData;
}

provide('grid', [DetailRow, Sort, Filter]);
provide('chart', [LineSeries, Legend, Tooltip, Category, DateTime, Highlight]);
</script>

<style scoped>
@import "~/assets/css/detail-template.css";
</style>