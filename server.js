const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable JSON parsing with large body limits (since state includes base64 signature images)
app.use(express.json({ limit: '10mb' }));

// Directory to store signed agreements
const STORAGE_DIR = path.join(__dirname, 'signed_agreements');
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR);
}

// API: Save signed agreement
app.post('/api/agreements', (req, res) => {
  try {
    const state = req.body;
    if (!state || !state.companyName) {
      return res.status(400).json({ error: 'Invalid agreement state. Company name is required.' });
    }

    // Clean company name for filename usage
    const cleanCompanyName = state.companyName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const cleanSow = (state.sowNumber || 'sow').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const timestamp = Date.now();
    const filename = `${cleanCompanyName}_${cleanSow}_${timestamp}.json`;
    const filePath = path.join(STORAGE_DIR, filename);

    // Save full JSON payload to file
    fs.writeFileSync(filePath, JSON.stringify(state, null, 2), 'utf8');
    
    console.log(`Saved agreement: ${filename}`);
    res.json({ success: true, filename });
  } catch (error) {
    console.error('Error saving agreement:', error);
    res.status(500).json({ error: 'Failed to save agreement on server.' });
  }
});

// API: Get all signed agreements
app.get('/api/agreements', (req, res) => {
  try {
    const files = fs.readdirSync(STORAGE_DIR);
    const agreements = [];

    files.forEach(file => {
      if (file.endsWith('.json')) {
        const filePath = path.join(STORAGE_DIR, file);
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          const data = JSON.parse(content);
          
          // Construct base64 url-safe state query parameter
          const jsonStr = JSON.stringify({
            c: data.companyName,
            j: data.jurisdiction,
            d: data.effectiveDay,
            m: data.effectiveMonth,
            ra: data.registeredAddress,
            gta: data.gtAddress,
            sown: data.sowNumber,
            proj: data.projectName,
            cl: data.clientName,
            sowd: data.sowExecDate,
            pm: data.gtPm,
            rep: data.facilityRep,
            fn: data.facilityName,
            fa: data.facilityAddress,
            fd: data.facilityDept,
            rz: data.recordingZones,
            ra_: data.restrictedAreas,
            ap: data.assemblyPoint,
            pc: data.primaryContact,
            sc: data.secondaryContact,
            ec: data.emergencyContact,
            si: data.specialInstructions,
            sn: data.signatoryName,
            sd: data.signatoryDesignation,
            st: data.sigType,
            sf: data.sigFont,
            sdt: data.sigData,
            ex: data.executionDate,
            ot_dom: data.txt_domainother,
            ot_dev: data.txt_deviceother,
            ot_dat: data.txt_dataother,
            // Checkboxes
            chk_robotics: data.chk_robotics,
            chk_computervision: data.chk_computervision,
            chk_embodiedai: data.chk_embodiedai,
            chk_industrialautomation: data.chk_industrialautomation,
            chk_foundationmodels: data.chk_foundationmodels,
            chk_research: data.chk_research,
            chk_domainother: data.chk_domainother,
            chk_headmounted: data.chk_headmounted,
            chk_bodycamera: data.chk_bodycamera,
            chk_smartphone: data.chk_smartphone,
            chk_actioncamera: data.chk_actioncamera,
            chk_dslr: data.chk_dslr,
            chk_depthcamera: data.chk_depthcamera,
            chk_lidar: data.chk_lidar,
            chk_audiorecorder: data.chk_audiorecorder,
            chk_imu: data.chk_imu,
            chk_deviceother: data.chk_deviceother,
            chk_rawvideo: data.chk_rawvideo,
            chk_metadata: data.chk_metadata,
            chk_annotations: data.chk_annotations,
            chk_qareports: data.chk_qareports,
            chk_benchmark: data.chk_benchmark,
            chk_evaluation: data.chk_evaluation,
            chk_dataother: data.chk_dataother,
            chk_fixedfee: data.chk_fixedfee,
            chk_dailyrate: data.chk_dailyrate,
            chk_hourly: data.chk_hourly,
            chk_nocostpilot: data.chk_nocostpilot,
            chk_clientsponsored: data.chk_clientsponsored,
            chk_collaboration: data.chk_collaboration
          });
          const base64UrlState = Buffer.from(jsonStr).toString('base64');

          agreements.push({
            filename: file,
            companyName: data.companyName,
            signatoryName: data.signatoryName,
            signatoryDesignation: data.signatoryDesignation,
            sowNumber: data.sowNumber,
            projectName: data.projectName,
            executionDate: data.executionDate,
            shareUrlState: base64UrlState
          });
        } catch (e) {
          console.warn(`Error parsing file ${file}:`, e);
        }
      }
    });

    // Sort by execution date descending
    agreements.sort((a, b) => b.filename.localeCompare(a.filename));
    res.json(agreements);
  } catch (error) {
    console.error('Error listing agreements:', error);
    res.status(500).json({ error: 'Failed to retrieve agreements list.' });
  }
});

// Serve Admin Dashboard HTML directly
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Serve frontend static files
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`  GroundTruth Agreement Execution server running`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`  Admin Dashboard: http://localhost:${PORT}/admin`);
  console.log(`=================================================`);
});
