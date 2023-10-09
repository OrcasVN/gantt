import { $, createSVG } from './svg_utils';

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
        this.make_table()

        this.make_table_header()
        this.make_table_content()
    }

    make_table() {
        // create table
        var table = document.createElement('table');
        table.style.width = '100%';

        // create thead
        const thead = document.createElement('thead')
        thead.style.height = this.gantt.options.header_height + 9 + 'px'
        table.appendChild(thead)

        // create tbody
        const tbody = document.createElement('tbody');
        table.appendChild(tbody)

        this.gantt.task_list.appendChild(table)

        this.thead = thead;
        this.tbody = tbody;
    }

    make_table_header() {
        const tr = document.createElement('tr')

        for (let c of this.columns) {
            var th = document.createElement('th')
            th.textContent = c.header
            th.style.width = c.width + 'px'
            tr.appendChild(th)
        }

        this.thead.appendChild(tr)
    }

    make_table_content() {
        for (let i = 0; i < this.tasks.length; i++) {

            const tr = document.createElement('tr');
            tr.style.height = this.gantt.options.bar_height + this.gantt.options.padding + 'px';
            for (let c of this.columns) {
                const td = document.createElement('td');
                const column = this.make_column(this.tasks[i], c)

                td.appendChild(column)
                tr.appendChild(td)
            }

            this.tbody.appendChild(tr);
        }

    }

    make_column(task, column) {
        const container = document.createElement('div')

        if (column.allowIndentLevel) {
            container.style.paddingLeft = 12 * task.indentLevel + 'px';
        }

        if (column.custom_html && typeof column.custom_html === 'function') {
            const html = column.custom_html(task, column)

            if (html) {
                container.innerHTML = html;

                // bind events
                if (column.events && Array.isArray(column.events)) {
                    column.events.forEach(event => {
                        $.on(container, event.type, event.target, (ev) => {
                            event.handler(task, column)
                        })
                    });
                }

            }
        } else {
            container.innerHTML = `<div class="task-list-content-wrapper">
                                        <div>${task[column.propertyName]}</div>
                                    </div>`
        }
        return container
    }
}