"use strict";
/**
 *
 * @param {JSON} rooms object containg all rooms( lobbys )
 */
// export default function TABLESELECT(rooms) {}

//TODO temporaty template only for tests
const TABLESELECT = `
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Nazwa pokoju</th>
              <th>Dostępność</th>
            </tr>
          </thead>
          <tbody>
        
            <tr>
              <th>1</th>
              <th>Nazwa pokoju</th>
              <th>Dostępny</th>
            </tr>
          </tbody>
        </table>
    `;

class TableSelect {
  constructor() {
    this.tableStructureData = [];
  }

  renderBasic() {
    this.table = document.createElement("table");
    this.tableHead = document.createElement("thead");
    this.namesRow = document.createElement("tr");
    this.rowOne = document.createElement("th");
    this.rowOne.innerText = "#";
    this.rowTwo = document.createElement("th");
    this.rowTwo.innerText = "Nazwa pokoju";
    this.rowTree = document.createElement("th");
    this.rowTree.innerText = "Dostępność";
    this.namesRow.appendChild(this.rowOne);
    this.namesRow.appendChild(this.rowTwo);
    this.namesRow.appendChild(this.rowTree);
    this.tableHead.appendChild(this.namesRow);
    this.table.appendChild(this.tableHead);
    this.tableBody = document.createElement("tbody");
    this.table.appendChild(this.tableBody);
    document.body.appendChild(this.table);
  }

  render(element, assignedNumber) {
    let row = document.createElement("tr");
    let cellNumber = document.createElement("th");
    cellNumber.innerText = assignedNumber;
    let roomName = document.createElement("th");
    roomName.innerText = element.roomName;
    let roomPrivate = document.createElement("th");
    roomPrivate.innerText = element.private ? "Prywatny" : "Publiczny";
    this.tableStructureData.push({
      number: assignedNumber,
      ...element,
      structure:{

      }
    });

    row.appendChild(cellNumber);
    row.appendChild(roomName);
    row.appendChild(roomPrivate);
    this.tableBody.appendChild(row);
  }
  reRender() {}
}

export default new TableSelect();
