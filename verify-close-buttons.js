const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  const filePath = 'file:///Users/cenk/Projects/roo-popup-generator/index.html';
  await page.goto(filePath);
  
  // Wait for page to load
  await page.waitForTimeout(2000);
  
  console.log('═══════════════════════════════════════════════════════');
  console.log('   CLOSE BUTTON VERIFICATION REPORT');
  console.log('═══════════════════════════════════════════════════════\n');
  
  // Get all template options
  const templates = await page.$$eval('#templateSelect option', opts => 
    opts.map(o => ({ value: o.value, text: o.textContent }))
  );
  
  console.log(`Found ${templates.length} templates:\n`);
  
  const closeButtonData = [];
  
  for (let i = 0; i < templates.length; i++) {
    const template = templates[i];
    console.log(`\n--- Template ${i + 1}: ${template.text} ---`);
    
    // Select the template
    await page.selectOption('#templateSelect', template.value);
    await page.waitForTimeout(800);
    
    // Check if close button exists in preview
    const closeButton = await page.$('#previewArea .popup-close');
    
    if (!closeButton) {
      console.log('❌ Close button NOT FOUND in preview');
      continue;
    }
    
    console.log('✅ Close button found');
    
    // Get computed styles and properties
    const buttonInfo = await page.$eval('#previewArea .popup-close', el => {
      const styles = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      
      return {
        // Position
        position: styles.position,
        top: styles.top,
        right: styles.right,
        
        // Size
        width: styles.width,
        height: styles.height,
        
        // Appearance
        borderRadius: styles.borderRadius,
        border: styles.border,
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        fontSize: styles.fontSize,
        
        // Display
        display: styles.display,
        alignItems: styles.alignItems,
        justifyContent: styles.justifyContent,
        
        // Z-index
        zIndex: styles.zIndex,
        
        // Content
        innerHTML: el.innerHTML,
        textContent: el.textContent,
        
        // Bounding box
        actualWidth: rect.width,
        actualHeight: rect.height
      };
    });
    
    closeButtonData.push({
      template: template.text,
      ...buttonInfo
    });
    
    console.log('Position:', buttonInfo.position, `top: ${buttonInfo.top}, right: ${buttonInfo.right}`);
    console.log('Size:', `${buttonInfo.width} x ${buttonInfo.height} (actual: ${buttonInfo.actualWidth.toFixed(1)}px x ${buttonInfo.actualHeight.toFixed(1)}px)`);
    console.log('Border Radius:', buttonInfo.borderRadius);
    console.log('Border:', buttonInfo.border);
    console.log('Background:', buttonInfo.backgroundColor);
    console.log('Color:', buttonInfo.color);
    console.log('Font Size:', buttonInfo.fontSize);
    console.log('Z-Index:', buttonInfo.zIndex);
    console.log('Content:', JSON.stringify(buttonInfo.textContent));
    
    // Take screenshot focused on the close button area
    const previewElement = await page.$('#previewArea');
    await previewElement.screenshot({ 
      path: `/Users/cenk/Projects/roo-popup-generator/close-button-${i + 1}-${template.text.replace(/\s+/g, '-')}.png`
    });
    console.log(`📸 Screenshot saved: close-button-${i + 1}-${template.text.replace(/\s+/g, '-')}.png`);
    
    // Take a zoomed screenshot of just the popup container
    const popupContainer = await page.$('#previewArea .popup-container');
    if (popupContainer) {
      await popupContainer.screenshot({ 
        path: `/Users/cenk/Projects/roo-popup-generator/popup-full-${i + 1}-${template.text.replace(/\s+/g, '-')}.png`
      });
    }
  }
  
  // Comparison Analysis
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('   CONSISTENCY ANALYSIS');
  console.log('═══════════════════════════════════════════════════════\n');
  
  const first = closeButtonData[0];
  let allConsistent = true;
  
  const propertiesToCheck = [
    'position', 'top', 'right', 'width', 'height', 
    'borderRadius', 'border', 'backgroundColor', 'color', 
    'fontSize', 'zIndex', 'textContent'
  ];
  
  for (const prop of propertiesToCheck) {
    const values = closeButtonData.map(d => d[prop]);
    const allSame = values.every(v => v === values[0]);
    
    if (allSame) {
      console.log(`✅ ${prop}: CONSISTENT across all templates`);
      console.log(`   Value: ${values[0]}`);
    } else {
      console.log(`❌ ${prop}: DIFFERENT across templates`);
      values.forEach((v, i) => {
        console.log(`   ${closeButtonData[i].template}: ${v}`);
      });
      allConsistent = false;
    }
    console.log('');
  }
  
  console.log('═══════════════════════════════════════════════════════');
  if (allConsistent) {
    console.log('✅ RESULT: All close buttons are CONSISTENT');
  } else {
    console.log('❌ RESULT: Close buttons have DIFFERENCES');
  }
  console.log('═══════════════════════════════════════════════════════\n');
  
  await browser.close();
})();
