document.getElementById('check-btn').addEventListener('click', () => {
  const url = document.getElementById('url-input').value;
  if (url) {
    document.getElementById('scanning').style.display = 'flex';
    document.getElementById('result-details').style.display = 'none';

    chrome.runtime.sendMessage({ action: 'checkURL', url }, (response) => {
      document.getElementById('scanning').style.display = 'none';
      const container = document.querySelector('.container');
      console.log('Full response:', response); // Debug log

      if (response.error) {
        console.error('Error:', response.error); // Debug log
        alert('Error checking URL: ' + response.error);
      } else {
        document.getElementById('result-details').style.display = 'block';

        // Debug logs for each value
        console.log('Domain age:', response.domain_age_days);
        console.log('Redirects:', response.redirects);
        console.log('Category:', response.category);
        console.log('Content Analysis Score:', response.content_analysis_score);
        console.log('Overall Risk Score:', response.overallRiskScore);
        console.log('Threat Level:', response.summary.threatLevel);
        console.log('Gemini Details:', response.gemini_details);

        // Set values with null checks

        
        document.getElementById('days').textContent = response.domain_age_days || 'N/A';
        document.getElementById('redirects').textContent = response.redirects ? response.redirects.length : 'N/A';
        document.getElementById('category').textContent = response.category || 'N/A';
        document.getElementById('contentAnalysisScore').textContent = response.content_analysis_score || 'N/A';
        document.getElementById('overallRiskScore').textContent = response.overallRiskScore || 'N/A';
        document.getElementById('threatLevel').textContent = response.summary.threatLevel || 'N/A';
        document.getElementById('geminiDetails').textContent = response.gemini_details || 'N/A';
        document.getElementById('aiAnalysis').textContent = 100 - response.overallRiskScore + ' %' || 'N/A';
        // document.getElementById('message').textContent = ' ' + response.summary.message || 'N/A';
        if(response.gemini_details){
          document.getElementById('message').textContent = ' the website appears to be safe';
        }else{
          document.getElementById('message').textContent = 'the website may be malicious';
        }

        if (response.content_analysis_score < 70) {
          document.getElementById('tab-3').classList.add('green');
        } else {
          document.getElementById('tab-3').classList.add('red');
        }
        
        if (response.summary.threatLevel === 'Low') {
          document.getElementById('tab-2-1-2').classList.add('green');
        } else {
          document.getElementById('tab-2-1-2').classList.add('red');
        }

        // Store the analysis result
        window.analysisResult = response;
      }
    });
  } else {
    alert('Please enter a URL.');
  }
});

document.getElementById('generate-report-btn').addEventListener('click', () => {
  if (!window.analysisResult) {
    alert('No analysis result available. Please check a URL first.');
    return;
  }

  const reportData = {
    url: document.getElementById('url-input').value,
    timestamp: new Date().toISOString(),
    analysis: window.analysisResult
  };

  try {
    // Create a detailed report window
    const reportWindow = window.open('', '_blank', 'width=800,height=600');
    reportWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Detailed Security Report - AntiPhish</title>
        <style>
          body { font-family: 'Inter', sans-serif; margin: 0; padding: 20px; }
          .report-container { max-width: 800px; margin: 0 auto; }
          .section { margin-bottom: 24px; }
          .section h2 { color: #2962ff; }
          .data-table { width: 100%; border-collapse: collapse; margin: 12px 0; }
          .data-table th, .data-table td { 
            padding: 8px; 
            border: 1px solid #dee2e6; 
            text-align: left; 
          }
          .risk-high { background: #ffebee; color: #c62828; }
          .risk-medium { background: #fff3cd; color: #856404; }
          .risk-low { background: #e8f5e9; color: #2e7d32; }
        </style>
      </head>
      <body>
        <div class="report-container">
          <h1>AntiPhish Security Report</h1>
          <div class="section">
            <h2>URL Information</h2>
            <p>Analyzed URL: ${reportData.url}</p>
            <p>Analysis Time: ${new Date().toLocaleString()}</p>
          </div>

          <div class="section">
            <h2>Risk Assessment</h2>
            <table class="data-table">
              <tr>
                <th>Risk Score</th>
                <td class="${getRiskClass(reportData.analysis.overallRiskScore)}">
                  ${reportData.analysis.overallRiskScore}%
                </td>
              </tr>
              <tr>
                <th>Threat Level</th>
                <td>${reportData.analysis.summary.threatLevel}</td>
              </tr>
              <tr>
                <th>AI Confidence</th>
                <td>${reportData.analysis.content_analysis_score}%</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <h2>Technical Details</h2>
            <table class="data-table">
              ${Object.entries(reportData.analysis)
                .map(([key, value]) => `
                  <tr>
                    <th>${formatIndicatorName(key)}</th>
                    <td>${typeof value === 'object' ? JSON.stringify(value) : value}</td>
                  </tr>
                `).join('')}
            </table>
          </div>

          <div class="section">
            <h2>Security Checks</h2>
            <ul>
              ${reportData.analysis.summary.message}
            </ul>
          </div>

          <div class="section">
            <h2>AI Analysis</h2>
            <p>${reportData.analysis.gemini_details}</p>
          </div>
        </div>
      </body>
      </html>
    `);
    reportWindow.document.close();
  } catch (error) {
    console.error('Error generating detailed report:', error);
    alert('Failed to generate detailed report');
  }
});

function getRiskClass(score) {
  if (score >= 75) return 'risk-high';
  if (score >= 50) return 'risk-medium';
  return 'risk-low';
}

function formatIndicatorName(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/_/g, ' ')
    .trim();
}

// Tab functionality - Improved version
document.querySelectorAll('.tab-btn').forEach(button => {
  button.addEventListener('click', () => {
    const tabId = button.dataset.tab;
    
    // Remove active classes
    document.querySelectorAll('.tab-btn, .tab-pane').forEach(element => {
      element.classList.remove('active');
    });

    // Add active classes
    button.classList.add('active');
    document.getElementById(tabId).classList.add('active');

    // Force redraw for animation
    document.getElementById(tabId).style.animation = 'none';
    requestAnimationFrame(() => {
      document.getElementById(tabId).style.animation = 'fadeIn 0.3s ease-in-out';
    });
  });
});