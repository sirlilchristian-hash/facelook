import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `              </div>
            ) : null}
          </div>
        </aside>`;
        
const replace = `              </div>
            ) : null}
          </div>
          </div>
        </aside>`;
        
if (code.includes(target)) {
    code = code.replace(target, replace);
} else {
    console.log("Not found.");
}
fs.writeFileSync('src/App.tsx', code, 'utf8');
