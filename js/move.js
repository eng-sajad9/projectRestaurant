const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');
const p1 = c.indexOf('<!-- Modals for Employee Stats and Activity Log -->');
const p2 = c.indexOf('    </div>\n  </div>\n\n  <!-- تم حذف', p1) !== -1 ?
    c.indexOf('    </div>\n  </div>\n\n  <!-- تم حذف', p1) :
    c.indexOf('    </div>\r\n  </div>\r\n\r\n  <!-- تم حذف', p1);

if (p1 === -1 || p2 === -1) {
    console.log('not found p1:', p1, 'p2:', p2);
    process.exit(1);
}

const block = c.substring(p1, p2);
c = c.substring(0, p1) + c.substring(p2);
c = c.replace('<!-- تم', block + '<!-- تم');
fs.writeFileSync('index.html', c);
console.log('Moved modals in index.html successfully.');
