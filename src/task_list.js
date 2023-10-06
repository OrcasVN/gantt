export default class TaskList {
    constructor(gantt, tasks, columns) {
        this.set_defaults(gantt, tasks, columns)
        this.render_task_list()
    }

    set_defaults(gantt, tasks, columns) {
        this.gantt = gantt;
        this.tasks = tasks;
        this.columns = columns;
        this.task_list_width = columns.reduce((acc, c) => acc + c.width, 0)
    }

    render_task_list() {
        console.log(this.gantt.$container)

        var tbl = document.createElement('table');
        tbl.style.width = '100%';

        const tHead = document.createElement('thead')
        tHead.style.height = this.gantt.options.header_height + 9 + 'px'
        const tr = document.createElement('tr')

        for (let c of this.columns) {
            var th = document.createElement('th')
            th.textContent = c.label
            th.style.width = c.width + 'px'
            tr.appendChild(th)
        }

        tHead.appendChild(tr)
        tbl.appendChild(tHead)
        var tbdy = document.createElement('tbody');

        for (var i = 0; i < this.tasks.length; i++) {
            const isDisplayed = this.gantt.get_all_dependent_tasks(this.tasks[i].id).every(id => this.tasks.find(t => t.id === id).expand)
            if (!isDisplayed) {
                break;
            }
            const tr = document.createElement('tr');
            tr.style.height = this.gantt.options.bar_height + this.gantt.options.padding + 'px'
            for (let c of this.columns) {
                var td = document.createElement('td')

                td.textContent = typeof c.key === 'string' ? this.tasks[i][c.key] : c.key(this.tasks[i])

                tr.appendChild(td)
            }

            tbdy.appendChild(tr);
        }
        tbl.appendChild(tbdy)

        this.gantt.task_list.appendChild(tbl)
    }
}