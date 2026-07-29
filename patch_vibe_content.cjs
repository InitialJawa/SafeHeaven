const fs = require('fs');
let code = fs.readFileSync('src/pages/AiManager.tsx', 'utf-8');

const targetStr = `          )}
          
          </div>
        </div>
      </div>
    </div>
  );
};`;

const replacementStr = `          )}

          {activeTab === 'vibe' && (
            <div className="flex-1 p-8 overflow-y-auto">
              <VibeTradingAgent />
            </div>
          )}
          
          </div>
        </div>
      </div>
    </div>
  );
};`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, replacementStr);
  fs.writeFileSync('src/pages/AiManager.tsx', code);
  console.log("Patched content successfully");
} else {
  console.log("Target not found!");
}
