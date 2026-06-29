/**
 * GroundTruth Master Facility Access Agreement Execution - App Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- State Management ---
  const state = {
    step: 1,
    companyName: '',
    jurisdiction: '',
    effectiveDay: '',
    effectiveMonth: '',
    registeredAddress: '',
    gtAddress: 'Sneh Kinara, Building No./Flat No.: 41/A/1, B/B Wing, Bopodi, Pune, Maharashtra, India, 411020',
    signatoryName: '',
    signatoryDesignation: '',
    sigType: 'draw', // 'draw' | 'type' | 'upload'
    sigFont: 'Great Vibes',
    sigData: '', // Base64 canvas path, text, or uploaded image data url
    executionDate: '',
    isReadOnly: false,

    // SOW Details
    sowNumber: '',
    projectName: '',
    clientName: '',
    sowExecDate: '',
    gtPm: '',
    facilityRep: '',

    // Facility Details
    facilityName: '',
    facilityAddress: '',
    facilityDept: '',
    recordingZones: '',
    restrictedAreas: '',
    assemblyPoint: '',
    primaryContact: '',
    secondaryContact: '',
    emergencyContact: '',
    specialInstructions: '',

    // Domain Checkboxes
    chk_robotics: false,
    chk_computervision: false,
    chk_embodiedai: false,
    chk_industrialautomation: false,
    chk_foundationmodels: false,
    chk_research: false,
    chk_domainother: false,
    txt_domainother: '',

    // Device Checkboxes
    chk_headmounted: false,
    chk_bodycamera: false,
    chk_smartphone: false,
    chk_actioncamera: false,
    chk_dslr: false,
    chk_depthcamera: false,
    chk_lidar: false,
    chk_audiorecorder: false,
    chk_imu: false,
    chk_deviceother: false,
    txt_deviceother: '',

    // Data Deliverable Checkboxes
    chk_rawvideo: false,
    chk_metadata: false,
    chk_annotations: false,
    chk_qareports: false,
    chk_benchmark: false,
    chk_evaluation: false,
    chk_dataother: false,
    txt_dataother: '',

    // Fee Model Checkboxes
    chk_fixedfee: false,
    chk_dailyrate: false,
    chk_hourly: false,
    chk_nocostpilot: false,
    chk_clientsponsored: false,
    chk_collaboration: false
  };

  // --- Element Selectors ---
  // Stepper Elements
  const stepIndicator1 = document.getElementById('stepIndicator1');
  const stepIndicator2 = document.getElementById('stepIndicator2');
  const stepIndicator3 = document.getElementById('stepIndicator3');

  // Wizard Step containers
  const step1El = document.getElementById('step1');
  const step2El = document.getElementById('step2');
  const step3El = document.getElementById('step3');

  // Form Inputs - Entity Details
  const inputCompanyName = document.getElementById('companyName');
  const inputJurisdiction = document.getElementById('jurisdiction');
  const inputEffectiveDay = document.getElementById('effectiveDay');
  const inputEffectiveMonth = document.getElementById('effectiveMonth');
  const inputRegisteredAddress = document.getElementById('registeredAddress');

  // Form Inputs - SOW Details
  const inputSowNumber = document.getElementById('sowNumber');
  const inputProjectName = document.getElementById('projectName');
  const inputClientName = document.getElementById('clientName');
  const inputSowExecDate = document.getElementById('sowExecDate');
  const inputGtPm = document.getElementById('gtPm');
  const inputFacilityRep = document.getElementById('facilityRep');

  // Form Inputs - Facility Details
  const inputFacilityName = document.getElementById('facilityName');
  const inputFacilityAddress = document.getElementById('facilityAddress');
  const inputFacilityDept = document.getElementById('facilityDept');
  const inputRecordingZones = document.getElementById('recordingZones');
  const inputRestrictedAreas = document.getElementById('restrictedAreas');
  const inputAssemblyPoint = document.getElementById('assemblyPoint');
  const inputPrimaryContact = document.getElementById('primaryContact');
  const inputSecondaryContact = document.getElementById('secondaryContact');
  const inputEmergencyContact = document.getElementById('emergencyContact');
  const inputSpecialInstructions = document.getElementById('specialInstructions');

  // Signatory details inputs
  const inputSignatoryName = document.getElementById('signatoryName');
  const inputSignatoryDesignation = document.getElementById('signatoryDesignation');

  // Checkboxes
  const checkboxIds = [
    'chk-robotics', 'chk-computervision', 'chk-embodiedai', 'chk-industrialautomation', 'chk-foundationmodels', 'chk-research',
    'chk-headmounted', 'chk-bodycamera', 'chk-smartphone', 'chk-actioncamera', 'chk-dslr', 'chk-depthcamera', 'chk-lidar', 'chk-audiorecorder', 'chk-imu',
    'chk-rawvideo', 'chk-metadata', 'chk-annotations', 'chk-qareports', 'chk-benchmark', 'chk-evaluation',
    'chk-fixedfee', 'chk-dailyrate', 'chk-hourly', 'chk-nocostpilot', 'chk-clientsponsored', 'chk-collaboration',
    'chk-domainother', 'chk-deviceother', 'chk-dataother'
  ];
  
  const otherTextInputIds = ['txt-domainother', 'txt-deviceother', 'txt-dataother'];

  // Signatures Elements
  const tabDrawSig = document.getElementById('tabDrawSig');
  const tabTypeSig = document.getElementById('tabTypeSig');
  const tabUploadSig = document.getElementById('tabUploadSig');

  const drawSigContainer = document.getElementById('drawSigContainer');
  const typeSigContainer = document.getElementById('typeSigContainer');
  const uploadSigContainer = document.getElementById('uploadSigContainer');

  const signatureCanvas = document.getElementById('signatureCanvas');
  const btnClearCanvas = document.getElementById('btnClearCanvas');
  const typedSigInput = document.getElementById('typedSigInput');
  const typedSigPreviewText = document.getElementById('typedSigPreviewText');
  const fontBtns = document.querySelectorAll('.font-btn');

  const sigImageUpload = document.getElementById('sigImageUpload');
  const uploadedSigImg = document.getElementById('uploadedSigImg');
  const uploadSigPreviewText = document.getElementById('uploadSigPreviewText');

  // Navigation Buttons
  const btnGoToStep2 = document.getElementById('btnGoToStep2');
  const btnBackToStep1 = document.getElementById('btnBackToStep1');
  const btnSignAgreement = document.getElementById('btnSignAgreement');
  const btnDownloadPDF = document.getElementById('btnDownloadPDF');
  const btnCopyLink = document.getElementById('btnCopyLink');
  const btnResetForm = document.getElementById('btnResetForm');
  
  // Mobile Switcher Buttons
  const btnMobileForm = document.getElementById('btnMobileForm');
  const btnMobilePreview = document.getElementById('btnMobilePreview');
  const wizardPane = document.getElementById('wizardPane');
  const previewPane = document.getElementById('previewPane');
  
  // Toolbar Buttons
  const btnScrollToSig = document.getElementById('btnScrollToSig');
  const btnToggleFullScreen = document.getElementById('btnToggleFullScreen');
  const appLayout = document.getElementById('appLayout');
  const previewBadge = document.getElementById('previewBadge');

  // Document Container & Loader
  const docLoading = document.getElementById('docLoading');
  const docHtmlContent = document.getElementById('docHtmlContent');
  const executionLoggedDate = document.getElementById('executionLoggedDate');
  const shareLinkInput = document.getElementById('shareLinkInput');
  const toastMsg = document.getElementById('toastMsg');

  // --- Canvas Signature Drawing Logic ---
  const canvasCtx = signatureCanvas.getContext('2d');
  let isDrawing = false;
  let hasDrawn = false;
  let strokes = []; // For SVG path serialization

  // Setup canvas high DPI support
  function setupCanvasDPI() {
    if (!signatureCanvas || drawSigContainer.classList.contains('hidden')) return;
    const rect = signatureCanvas.getBoundingClientRect();
    if (rect.width === 0) return; // Hidden initially
    const dpr = window.devicePixelRatio || 1;
    signatureCanvas.width = rect.width * dpr;
    signatureCanvas.height = rect.height * dpr;
    canvasCtx.scale(dpr, dpr);
    
    // Set drawing styles
    canvasCtx.strokeStyle = '#1a1c1c'; // Ink color
    canvasCtx.lineWidth = 2.5;
    canvasCtx.lineCap = 'round';
    canvasCtx.lineJoin = 'round';
    
    clearSignatureCanvas();
  }

  // Clear Canvas
  function clearSignatureCanvas() {
    canvasCtx.fillStyle = '#ffffff';
    canvasCtx.fillRect(0, 0, signatureCanvas.width, signatureCanvas.height);
    strokes = [];
    hasDrawn = false;
    if (state.sigType === 'draw') {
      state.sigData = '';
    }
    updateDocSignaturePreview();
  }

  // Coordinates helper
  function getCoordinates(e) {
    const rect = signatureCanvas.getBoundingClientRect();
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  // Start Drawing
  function startDrawing(e) {
    if (state.isReadOnly) return;
    isDrawing = true;
    const coords = getCoordinates(e);
    canvasCtx.beginPath();
    canvasCtx.moveTo(coords.x, coords.y);
    strokes.push(`M ${coords.x.toFixed(1)} ${coords.y.toFixed(1)}`);
    e.preventDefault();
  }

  // Draw
  function draw(e) {
    if (!isDrawing || state.isReadOnly) return;
    const coords = getCoordinates(e);
    canvasCtx.lineTo(coords.x, coords.y);
    canvasCtx.stroke();
    strokes.push(`L ${coords.x.toFixed(1)} ${coords.y.toFixed(1)}`);
    hasDrawn = true;
    e.preventDefault();
  }

  // Stop Drawing
  function stopDrawing() {
    if (isDrawing) {
      isDrawing = false;
      canvasCtx.closePath();
      if (state.sigType === 'draw' && hasDrawn) {
        state.sigData = strokes.join(' ');
      }
      updateDocSignaturePreview();
    }
  }

  // Bind Signature Drawing Events
  signatureCanvas.addEventListener('mousedown', startDrawing);
  signatureCanvas.addEventListener('mousemove', draw);
  signatureCanvas.addEventListener('mouseup', stopDrawing);
  signatureCanvas.addEventListener('mouseout', stopDrawing);

  signatureCanvas.addEventListener('touchstart', startDrawing, { passive: false });
  signatureCanvas.addEventListener('touchmove', draw, { passive: false });
  signatureCanvas.addEventListener('touchend', stopDrawing);

  btnClearCanvas.addEventListener('click', clearSignatureCanvas);

  // Resize canvas handler
  window.addEventListener('resize', () => {
    if (state.sigType === 'draw') {
      setupCanvasDPI();
    }
  });

  // --- Signature Mode Tabs ---
  function selectSignatureTab(type) {
    state.sigType = type;
    [tabDrawSig, tabTypeSig, tabUploadSig].forEach(tab => tab.classList.remove('active'));
    [drawSigContainer, typeSigContainer, uploadSigContainer].forEach(c => c.classList.add('hidden'));

    if (type === 'draw') {
      tabDrawSig.classList.add('active');
      drawSigContainer.classList.remove('hidden');
      setTimeout(setupCanvasDPI, 50);
    } else if (type === 'type') {
      tabTypeSig.classList.add('active');
      typeSigContainer.classList.remove('hidden');
    } else if (type === 'upload') {
      tabUploadSig.classList.add('active');
      uploadSigContainer.classList.remove('hidden');
    }
    updateDocSignaturePreview();
  }

  tabDrawSig.addEventListener('click', () => selectSignatureTab('draw'));
  tabTypeSig.addEventListener('click', () => selectSignatureTab('type'));
  tabUploadSig.addEventListener('click', () => selectSignatureTab('upload'));

  // Typed Signature input change
  typedSigInput.addEventListener('input', (e) => {
    const val = e.target.value;
    typedSigPreviewText.textContent = val || 'Signature Preview';
    if (state.sigType === 'type') {
      state.sigData = val;
    }
    updateDocSignaturePreview();
  });

  // Typed Font options
  fontBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      fontBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const font = btn.getAttribute('data-font');
      state.sigFont = font;
      
      if (font === 'Montserrat') {
        typedSigPreviewText.style.fontFamily = "'Montserrat', sans-serif";
        typedSigPreviewText.style.fontStyle = "italic";
        typedSigPreviewText.style.fontWeight = "600";
      } else {
        typedSigPreviewText.style.fontFamily = `'${font}', cursive`;
        typedSigPreviewText.style.fontStyle = "normal";
        typedSigPreviewText.style.fontWeight = "normal";
      }
      updateDocSignaturePreview();
    });
  });

  // Upload Signature Image handler
  sigImageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit.');
        sigImageUpload.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        state.sigData = dataUrl;
        
        uploadedSigImg.src = dataUrl;
        uploadedSigImg.classList.remove('hidden');
        uploadSigPreviewText.classList.add('hidden');
        
        updateDocSignaturePreview();
      };
      reader.readAsDataURL(file);
    }
  });

  // --- Mobile Switcher tabs ---
  if (btnMobileForm && btnMobilePreview) {
    btnMobileForm.addEventListener('click', () => {
      btnMobileForm.classList.add('active');
      btnMobilePreview.classList.remove('active');
      wizardPane.classList.remove('hidden-mobile');
      previewPane.classList.remove('active-mobile');
    });

    btnMobilePreview.addEventListener('click', () => {
      btnMobilePreview.classList.add('active');
      btnMobileForm.classList.remove('active');
      wizardPane.classList.add('hidden-mobile');
      previewPane.classList.add('active-mobile');
      setTimeout(setupCanvasDPI, 100);
    });
  }

  // --- Document Update Listeners (Sync Wizard Form to Paper Document) ---

  function setupFormSync() {
    // Helper to update elements in the preview paper
    const syncText = (inputEl, targetSpanId, fallbackVal, stateKey) => {
      if (!inputEl) return;
      const target = document.getElementById(targetSpanId);
      
      const updateValue = () => {
        const val = inputEl.value;
        state[stateKey || inputEl.id] = val;
        
        if (target) {
          if (val.trim()) {
            target.textContent = val;
            target.classList.add('filled');
          } else {
            target.textContent = fallbackVal;
            target.classList.remove('filled');
          }
        }
      };

      inputEl.addEventListener('input', updateValue);
      // Run once initially
      updateValue();
    };

    // Main Entity Details
    syncText(inputCompanyName, 'view-company-name', '[ Company Name ]', 'companyName');
    syncText(inputJurisdiction, 'view-jurisdiction', '[ Jurisdiction ]', 'jurisdiction');
    syncText(inputEffectiveDay, 'view-effective-day', '[ Day ]', 'effectiveDay');
    syncText(inputEffectiveMonth, 'view-effective-month', '[ Month ]', 'effectiveMonth');
    syncText(inputRegisteredAddress, 'view-company-address', '[ Registered Office Address ]', 'registeredAddress');
    
    // SOW details
    syncText(inputSowNumber, 'view-sow-number', '[ SOW Number ]', 'sowNumber');
    syncText(inputProjectName, 'view-project-name', '[ Project Name ]', 'projectName');
    syncText(inputClientName, 'view-client-name', '[ Client Name ]', 'clientName');
    syncText(inputSowExecDate, 'view-sow-exec-date', '[ Date of Execution ]', 'sowExecDate');
    syncText(inputGtPm, 'view-gt-pm', '[ PM Name ]', 'gtPm');
    syncText(inputFacilityRep, 'view-facility-rep', '[ Representative Name ]', 'facilityRep');

    // SOW Facility Details
    syncText(inputFacilityName, 'view-facility-name', '[ Facility Name ]', 'facilityName');
    syncText(inputFacilityAddress, 'view-facility-address', '[ Facility Address ]', 'facilityAddress');
    syncText(inputFacilityDept, 'view-facility-dept', '[ Department / Area ]', 'facilityDept');
    syncText(inputRecordingZones, 'view-recording-zones', '[ Recording Zones ]', 'recordingZones');
    syncText(inputRestrictedAreas, 'view-restricted-areas', '[ Restricted Areas ]', 'restrictedAreas');
    syncText(inputAssemblyPoint, 'view-assembly-point', '[ Emergency Assembly Point ]', 'assemblyPoint');
    syncText(inputPrimaryContact, 'view-primary-contact', '[ Primary Contact ]', 'primaryContact');
    syncText(inputSecondaryContact, 'view-secondary-contact', '[ Secondary Contact ]', 'secondaryContact');
    syncText(inputEmergencyContact, 'view-emergency-contact', '[ Emergency Contact Number ]', 'emergencyContact');
    
    // Special Instructions (Multi-line pre-wrap textarea)
    inputSpecialInstructions.addEventListener('input', () => {
      const val = inputSpecialInstructions.value;
      state.specialInstructions = val;
      const target = document.getElementById('view-special-instructions');
      if (target) {
        if (val.trim()) {
          target.textContent = val;
          target.classList.add('filled');
        } else {
          target.textContent = '[ Special Instructions ]';
          target.classList.remove('filled');
        }
      }
    });

    // Signatory Name
    inputSignatoryName.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      state.signatoryName = val;
      
      const targets = ['view-sig-name', 'view-sow-sig-name'];
      targets.forEach(tid => {
        const el = document.getElementById(tid);
        if (el) {
          el.textContent = val || '[ Signatory Name ]';
          if (val) el.classList.add('filled');
          else el.classList.remove('filled');
        }
      });
    });

    // Signatory Designation
    inputSignatoryDesignation.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      state.signatoryDesignation = val;
      
      const targets = ['view-sig-designation', 'view-sow-sig-designation'];
      targets.forEach(tid => {
        const el = document.getElementById(tid);
        if (el) {
          el.textContent = val || '[ Designation ]';
          if (val) el.classList.add('filled');
          else el.classList.remove('filled');
        }
      });
    });

    // Sync Company name to approvals subheader
    inputCompanyName.addEventListener('input', (e) => {
      const val = e.target.value.trim();
      const targets = ['view-sig-for-title', 'view-sow-sig-for-title'];
      targets.forEach(tid => {
        const el = document.getElementById(tid);
        if (el) {
          el.textContent = val || '[ Company Name ]';
        }
      });
    });

    // Checkbox synchronization listeners
    checkboxIds.forEach(cid => {
      const input = document.getElementById(cid);
      if (!input) return;

      const stateKey = cid.replace('-', '_');
      const viewId = `view-check-${cid.replace('chk-', '')}`;

      const updateCheckbox = () => {
        const isChecked = input.checked;
        state[stateKey] = isChecked;

        // Toggle state other texts
        if (cid === 'chk-domainother') {
          document.getElementById('txt-domainother').disabled = !isChecked;
        } else if (cid === 'chk-deviceother') {
          document.getElementById('txt-deviceother').disabled = !isChecked;
        } else if (cid === 'chk-dataother') {
          document.getElementById('txt-dataother').disabled = !isChecked;
        }

        const viewSpan = document.getElementById(viewId);
        if (viewSpan) {
          viewSpan.textContent = isChecked ? '☑' : '☐';
          if (isChecked) {
            viewSpan.style.color = 'var(--secondary-green)';
          } else {
            viewSpan.style.color = 'inherit';
          }
        }
      };

      input.addEventListener('change', updateCheckbox);
      updateCheckbox(); // Run once initially
    });

    // Checkbox Other Texts synchronization
    otherTextInputIds.forEach(tid => {
      const input = document.getElementById(tid);
      if (!input) return;

      const stateKey = tid.replace('-', '_');
      const viewId = `view-${tid.replace('txt-', '')}-text`;

      const updateOtherText = () => {
        const val = input.value.trim();
        state[stateKey] = val;

        const viewSpan = document.getElementById(viewId);
        if (viewSpan) {
          viewSpan.textContent = val ? `(${val})` : '';
          if (val) viewSpan.classList.add('filled');
          else viewSpan.classList.remove('filled');
        }
      };

      input.addEventListener('input', updateOtherText);
      updateOtherText();
    });
  }

  // --- Step Navigation Logic ---

  function validateStep1() {
    if (!inputCompanyName.value.trim()) return 'Company Name is required.';
    if (!inputJurisdiction.value.trim()) return 'Jurisdiction is required.';
    if (!inputEffectiveDay.value.trim()) return 'Effective Day is required.';
    if (!inputEffectiveMonth.value.trim()) return 'Effective Month is required.';
    if (!inputRegisteredAddress.value.trim()) return 'Registered Address is required.';
    
    // Validate SOW fields
    if (!inputSowNumber.value.trim()) return 'SOW Number is required.';
    if (!inputProjectName.value.trim()) return 'SOW Project Name is required.';
    if (!inputSowExecDate.value.trim()) return 'SOW Execution Date is required.';
    if (!inputGtPm.value.trim()) return 'GroundTruth PM name is required.';
    if (!inputFacilityRep.value.trim()) return 'Facility Representative name is required.';

    // Validate Facility details
    if (!inputFacilityName.value.trim()) return 'Facility Name is required.';
    if (!inputFacilityAddress.value.trim()) return 'Facility Address is required.';
    if (!inputFacilityDept.value.trim()) return 'Department / Area is required.';
    if (!inputRecordingZones.value.trim()) return 'Recording Zones is required.';
    if (!inputRestrictedAreas.value.trim()) return 'Restricted Areas is required.';
    if (!inputAssemblyPoint.value.trim()) return 'Emergency Assembly Point is required.';
    if (!inputPrimaryContact.value.trim()) return 'Primary Contact is required.';
    if (!inputSecondaryContact.value.trim()) return 'Secondary Contact is required.';
    if (!inputEmergencyContact.value.trim()) return 'Emergency Contact Number is required.';
    
    return null;
  }

  function validateStep2() {
    if (!inputSignatoryName.value.trim()) return 'Signatory Name is required.';
    if (!inputSignatoryDesignation.value.trim()) return 'Designation/Title is required.';
    if (state.sigType === 'draw' && !hasDrawn) return 'Please draw your signature.';
    if (state.sigType === 'type' && !typedSigInput.value.trim()) return 'Please type your signature.';
    if (state.sigType === 'upload' && !state.sigData) return 'Please upload a signature image.';
    return null;
  }

  // Transition between steps
  function setStep(newStep) {
    state.step = newStep;

    // Manage indicators
    [stepIndicator1, stepIndicator2, stepIndicator3].forEach((indicator, index) => {
      const stepNum = index + 1;
      indicator.classList.remove('active', 'completed');
      if (stepNum === newStep) {
        indicator.classList.add('active');
      } else if (stepNum < newStep) {
        indicator.classList.add('completed');
      }
    });

    // Toggle steps
    [step1El, step2El, step3El].forEach((stepEl, index) => {
      const stepNum = index + 1;
      if (stepNum === newStep) {
        stepEl.classList.add('active');
      } else {
        stepEl.classList.remove('active');
      }
    });

    // Adjust status texts
    if (newStep === 1) {
      document.getElementById('systemStatus').textContent = 'Filling Details';
      previewBadge.textContent = 'Live Draft';
      previewBadge.className = 'badge badge-outline';
    } else if (newStep === 2) {
      document.getElementById('systemStatus').textContent = 'Review & Sign';
      previewBadge.textContent = 'Ready to Sign';
      previewBadge.className = 'badge badge-outline';
      setTimeout(setupCanvasDPI, 50);
    } else if (newStep === 3) {
      document.getElementById('systemStatus').textContent = 'Agreement Executed';
      previewBadge.textContent = 'Executed & Locked';
      previewBadge.className = 'badge badge-green';
    }
  }

  btnGoToStep2.addEventListener('click', () => {
    const error = validateStep1();
    if (error) {
      alert(error);
      return;
    }
    setStep(2);
    
    // Auto switch to preview tab on mobile for drawing signatures
    if (window.innerWidth <= 900 && btnMobilePreview) {
      btnMobilePreview.click();
    }
    
    scrollToApprovalsSection();
  });

  btnBackToStep1.addEventListener('click', () => {
    setStep(1);
    
    // Auto switch back to form on mobile
    if (window.innerWidth <= 900 && btnMobileForm) {
      btnMobileForm.click();
    }
  });

  btnSignAgreement.addEventListener('click', () => {
    const error = validateStep2();
    if (error) {
      alert(error);
      return;
    }
    
    // Auto log date
    const now = new Date();
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    state.executionDate = now.toLocaleDateString('en-US', dateOptions);
    executionLoggedDate.textContent = state.executionDate;
    
    // Update dates in preview doc
    const dates = ['view-sig-date', 'view-gt-sig-date', 'view-sow-sig-date', 'view-sow-gt-sig-date'];
    dates.forEach(tid => {
      const el = document.getElementById(tid);
      if (el) {
        el.textContent = state.executionDate;
        el.classList.add('filled');
      }
    });

    finalizeExecution();
  });

  function finalizeExecution() {
    setStep(3);
    const shareableLink = generateShareableLink();
    shareLinkInput.value = shareableLink;
    saveToLocalStorage();
    
    // Post to Express backend database registry
    fetch('/api/agreements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(state)
    })
    .then(res => res.json())
    .then(data => {
      console.log('Agreement synced with registry database:', data);
    })
    .catch(err => {
      console.warn('Backend server registry skipped (offline or static mode):', err);
    });

    // Switch to preview tab on mobile to let them download
    if (window.innerWidth <= 900 && btnMobilePreview) {
      btnMobilePreview.click();
    }
    
    scrollToTop();
  }

  // --- Scrolling Utility ---
  function scrollToApprovalsSection() {
    const target = document.getElementById('view-sig-name') || document.getElementById('view-sow-sig-name');
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  function scrollToTop() {
    const docContainer = document.querySelector('.document-container');
    if (docContainer) {
      docContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }

  btnScrollToSig.addEventListener('click', scrollToApprovalsSection);

  // Full Screen preview toggle
  btnToggleFullScreen.addEventListener('click', () => {
    appLayout.classList.toggle('full-preview');
    const isFull = appLayout.classList.contains('full-preview');
    
    const label = btnToggleFullScreen.querySelector('span');
    const icon = document.getElementById('fullScreenIcon');
    
    if (isFull) {
      label.textContent = "Exit Full Screen";
      icon.innerHTML = `<path d="M4 14h6v6m10-6h-6v6M4 10h6V4m10 6h-6V4"/>`;
    } else {
      label.textContent = "Full Screen";
      icon.innerHTML = `<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>`;
    }
    setTimeout(setupCanvasDPI, 200);
  });

  // PDF Download / Print
  btnDownloadPDF.addEventListener('click', () => {
    window.print();
  });

  // --- Serialization Logic (Share Link & Local Storage) ---

  function generateShareableLink() {
    // Collect active checkboxes
    const activeCheckboxes = [];
    checkboxIds.forEach(cid => {
      const stateKey = cid.replace('-', '_');
      if (state[stateKey]) {
        activeCheckboxes.push(cid);
      }
    });

    const payload = {
      // Entity details
      c: state.companyName,
      j: state.jurisdiction,
      d: state.effectiveDay,
      m: state.effectiveMonth,
      ra: state.registeredAddress,
      gta: state.gtAddress,
      // SOW details
      sown: state.sowNumber,
      proj: state.projectName,
      cl: state.clientName,
      sowd: state.sowExecDate,
      pm: state.gtPm,
      rep: state.facilityRep,
      // Facility details
      fn: state.facilityName,
      fa: state.facilityAddress,
      fd: state.facilityDept,
      rz: state.recordingZones,
      ra_: state.restrictedAreas,
      ap: state.assemblyPoint,
      pc: state.primaryContact,
      sc: state.secondaryContact,
      ec: state.emergencyContact,
      si: state.specialInstructions,
      // Signatures details
      sn: state.signatoryName,
      sd: state.signatoryDesignation,
      st: state.sigType,
      sf: state.sigFont,
      sdt: state.sigData,
      ex: state.executionDate,
      // Checkboxes array
      chks: activeCheckboxes,
      // Other text inputs
      ot_dom: state.txt_domainother,
      ot_dev: state.txt_deviceother,
      ot_dat: state.txt_dataother
    };

    const jsonStr = JSON.stringify(payload);
    const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
    const baseUrl = window.location.href.split('?')[0];
    return `${baseUrl}?signed=true&data=${encoded}`;
  }

  function loadStateFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const isSignedUrl = urlParams.get('signed');
    const encodedData = urlParams.get('data');

    if (isSignedUrl === 'true' && encodedData) {
      try {
        const decodedJson = decodeURIComponent(escape(atob(encodedData)));
        const data = JSON.parse(decodedJson);

        // Map to state
        state.companyName = data.c || '';
        state.jurisdiction = data.j || '';
        state.effectiveDay = data.d || '';
        state.effectiveMonth = data.m || '';
        state.registeredAddress = data.ra || '';
        state.gtAddress = 'Sneh Kinara, Building No./Flat No.: 41/A/1, B/B Wing, Bopodi, Pune, Maharashtra, India, 411020';

        state.sowNumber = data.sown || '';
        state.projectName = data.proj || '';
        state.clientName = data.cl || '';
        state.sowExecDate = data.sowd || '';
        state.gtPm = data.pm || '';
        state.facilityRep = data.rep || '';

        state.facilityName = data.fn || '';
        state.facilityAddress = data.fa || '';
        state.facilityDept = data.fd || '';
        state.recordingZones = data.rz || '';
        state.restrictedAreas = data.ra_ || '';
        state.assemblyPoint = data.ap || '';
        state.primaryContact = data.pc || '';
        state.secondaryContact = data.sc || '';
        state.emergencyContact = data.ec || '';
        state.specialInstructions = data.si || '';

        state.signatoryName = data.sn || '';
        state.signatoryDesignation = data.sd || '';
        state.sigType = data.st || 'draw';
        state.sigFont = data.sf || 'Great Vibes';
        state.sigData = data.sdt || '';
        state.executionDate = data.ex || '';

        state.txt_domainother = data.ot_dom || '';
        state.txt_deviceother = data.ot_dev || '';
        state.txt_dataother = data.ot_dat || '';

        // Reset check states
        checkboxIds.forEach(cid => {
          state[cid.replace('-', '_')] = false;
        });

        // Set loaded checks
        if (Array.isArray(data.chks)) {
          data.chks.forEach(cid => {
            state[cid.replace('-', '_')] = true;
          });
        }

        state.isReadOnly = true;

        // Populate Form Fields
        inputCompanyName.value = state.companyName;
        inputJurisdiction.value = state.jurisdiction;
        inputEffectiveDay.value = state.effectiveDay;
        inputEffectiveMonth.value = state.effectiveMonth;
        inputRegisteredAddress.value = state.registeredAddress;

        inputSowNumber.value = state.sowNumber;
        inputProjectName.value = state.projectName;
        inputClientName.value = state.clientName;
        inputSowExecDate.value = state.sowExecDate;
        inputGtPm.value = state.gtPm;
        inputFacilityRep.value = state.facilityRep;

        inputFacilityName.value = state.facilityName;
        inputFacilityAddress.value = state.facilityAddress;
        inputFacilityDept.value = state.facilityDept;
        inputRecordingZones.value = state.recordingZones;
        inputRestrictedAreas.value = state.restrictedAreas;
        inputAssemblyPoint.value = state.assemblyPoint;
        inputPrimaryContact.value = state.primaryContact;
        inputSecondaryContact.value = state.secondaryContact;
        inputEmergencyContact.value = state.emergencyContact;
        inputSpecialInstructions.value = state.specialInstructions;

        inputSignatoryName.value = state.signatoryName;
        inputSignatoryDesignation.value = state.signatoryDesignation;

        document.getElementById('txt-domainother').value = state.txt_domainother;
        document.getElementById('txt-deviceother').value = state.txt_deviceother;
        document.getElementById('txt-dataother').value = state.txt_dataother;

        // Apply checked statuses to checkbox elements
        checkboxIds.forEach(cid => {
          const el = document.getElementById(cid);
          if (el) {
            el.checked = state[cid.replace('-', '_')];
          }
        });

        // Disable elements (ReadOnly Mode)
        const inputsToDisable = [
          inputCompanyName, inputJurisdiction, inputEffectiveDay, inputEffectiveMonth, 
          inputRegisteredAddress, inputSowNumber, inputProjectName, 
          inputClientName, inputSowExecDate, inputGtPm, inputFacilityRep, 
          inputFacilityName, inputFacilityAddress, inputFacilityDept, inputRecordingZones,
          inputRestrictedAreas, inputAssemblyPoint, inputPrimaryContact, inputSecondaryContact,
          inputEmergencyContact, inputSpecialInstructions, inputSignatoryName, inputSignatoryDesignation,
          document.getElementById('txt-domainother'),
          document.getElementById('txt-deviceother'),
          document.getElementById('txt-dataother')
        ];
        
        inputsToDisable.forEach(el => { if (el) el.disabled = true; });
        checkboxIds.forEach(cid => {
          const el = document.getElementById(cid);
          if (el) el.disabled = true;
        });

        executionLoggedDate.textContent = state.executionDate;
        
        // Show uploaded image in input preview
        if (state.sigType === 'upload' && state.sigData) {
          uploadedSigImg.src = state.sigData;
          uploadedSigImg.classList.remove('hidden');
          uploadSigPreviewText.classList.add('hidden');
        } else if (state.sigType === 'type') {
          typedSigInput.value = state.sigData;
          typedSigPreviewText.textContent = state.sigData;
        }

        // Force mobile view state to preview on read-only load
        if (window.innerWidth <= 900 && btnMobilePreview) {
          setTimeout(() => btnMobilePreview.click(), 100);
        }

        return true;
      } catch (err) {
        console.error("Failed to decode shareable URL data:", err);
      }
    }
    return false;
  }

  // Clipboard copy
  btnCopyLink.addEventListener('click', () => {
    shareLinkInput.select();
    shareLinkInput.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(shareLinkInput.value)
      .then(() => {
        toastMsg.classList.add('show');
        setTimeout(() => toastMsg.classList.remove('show'), 2500);
      })
      .catch(err => console.error('Could not copy link: ', err));
  });

  // Local Storage
  function saveToLocalStorage() {
    try {
      localStorage.setItem('gt_agreement_state', JSON.stringify(state));
    } catch (e) {
      console.warn("Could not save to local storage:", e);
    }
  }

  function loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem('gt_agreement_state');
      if (stored) {
        const cached = JSON.parse(stored);
        Object.assign(state, cached);
        
        // Populate inputs
        inputCompanyName.value = state.companyName || '';
        inputJurisdiction.value = state.jurisdiction || '';
        inputEffectiveDay.value = state.effectiveDay || '';
        inputEffectiveMonth.value = state.effectiveMonth || '';
        inputRegisteredAddress.value = state.registeredAddress || '';

        inputSowNumber.value = state.sowNumber || '';
        inputProjectName.value = state.projectName || '';
        inputClientName.value = state.clientName || '';
        inputSowExecDate.value = state.sowExecDate || '';
        inputGtPm.value = state.gtPm || '';
        inputFacilityRep.value = state.facilityRep || '';

        inputFacilityName.value = state.facilityName || '';
        inputFacilityAddress.value = state.facilityAddress || '';
        inputFacilityDept.value = state.facilityDept || '';
        inputRecordingZones.value = state.recordingZones || '';
        inputRestrictedAreas.value = state.restrictedAreas || '';
        inputAssemblyPoint.value = state.assemblyPoint || '';
        inputPrimaryContact.value = state.primaryContact || '';
        inputSecondaryContact.value = state.secondaryContact || '';
        inputEmergencyContact.value = state.emergencyContact || '';
        inputSpecialInstructions.value = state.specialInstructions || '';

        inputSignatoryName.value = state.signatoryName || '';
        inputSignatoryDesignation.value = state.signatoryDesignation || '';

        document.getElementById('txt-domainother').value = state.txt_domainother || '';
        document.getElementById('txt-deviceother').value = state.txt_deviceother || '';
        document.getElementById('txt-dataother').value = state.txt_dataother || '';

        // Apply checked statuses
        checkboxIds.forEach(cid => {
          const el = document.getElementById(cid);
          if (el) {
            el.checked = state[cid.replace('-', '_')] || false;
          }
        });

        // Set Tab UI state
        selectSignatureTab(state.sigType);

        if (state.sigType === 'type') {
          typedSigInput.value = state.sigData || '';
          typedSigPreviewText.textContent = state.sigData || 'Signature Preview';
        } else if (state.sigType === 'upload' && state.sigData) {
          uploadedSigImg.src = state.sigData;
          uploadedSigImg.classList.remove('hidden');
          uploadSigPreviewText.classList.add('hidden');
        } else if (state.sigType === 'draw' && state.sigData) {
          strokes = state.sigData.split(' L ').length > 0 ? state.sigData.split(/(?=[ML])/) : [];
          hasDrawn = strokes.length > 0;
        }
      }
    } catch (e) {
      console.warn("Could not load from local storage:", e);
    }
  }

  btnResetForm.addEventListener('click', () => {
    if (confirm("Are you sure you want to clear this agreement? This will delete all inputs and start a fresh execution.")) {
      localStorage.removeItem('gt_agreement_state');
      window.location.search = '';
    }
  });

  // --- Update Doc Signature Preview Slots ---
  function updateDocSignaturePreview() {
    const containers = ['view-sig-image-container', 'view-sow-sig-image-container'];
    
    containers.forEach(cid => {
      const container = document.getElementById(cid);
      if (!container) return;

      if (!state.sigData) {
        container.innerHTML = '<span class="sig-placeholder-text">Pending Signature</span>';
        return;
      }

      if (state.sigType === 'draw') {
        container.innerHTML = `
          <svg viewBox="0 0 280 90" style="width: 100%; height: 100%; max-height: 90px; display: block;">
            <path d="${state.sigData}" fill="none" stroke="#1a1c1c" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
      } else if (state.sigType === 'type') {
        let fontStyle = '';
        if (state.sigFont === 'Montserrat') {
          fontStyle = "font-family: 'Montserrat', sans-serif; font-style: italic; font-weight: 600;";
        } else {
          fontStyle = `font-family: '${state.sigFont}', cursive; font-weight: normal; font-style: normal;`;
        }
        container.innerHTML = `
          <span class="typed-signature-rendered" style="${fontStyle} font-size: 1.6rem; color: #1a1c1c; white-space: nowrap; line-height: 1.2;">
            ${state.sigData}
          </span>
        `;
      } else if (state.sigType === 'upload') {
        container.innerHTML = `
          <img src="${state.sigData}" alt="Uploaded Signature" style="max-width: 100%; max-height: 80px; object-fit: contain; display: block; margin: 0 auto;" />
        `;
      }
    });
  }

  // --- Fetch & Parse Master Agreement Markdown ---

  function fetchAndRenderAgreement() {
    docLoading.classList.remove('hidden');
    docHtmlContent.classList.add('hidden');

    fetch('MASTER FACILITY ACCESS, RECORDING & AI DATA COLLECTION AGREEMENT.md')
      .then(response => {
        if (!response.ok) throw new Error('Agreement file not found.');
        return response.text();
      })
      .then(markdownText => {
        // Run pre-processing
        const preparedMarkdown = injectPlaceholdersIntoMarkdown(markdownText);
        
        // Render markdown to HTML
        const html = marked.parse(preparedMarkdown);
        docHtmlContent.innerHTML = html;
        
        docLoading.classList.add('hidden');
        docHtmlContent.classList.remove('hidden');
        
        setupFormSync();
        
        if (state.isReadOnly) {
          updateReadOnlyDocumentView();
        } else {
          updateDocumentViewFromState();
        }
      })
      .catch(error => {
        console.error('Error loading Master Agreement:', error);
        docLoading.innerHTML = `
          <div class="error-msg" style="color: var(--danger-red); text-align:center; padding: 20px;">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom:8px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p><strong>Failed to load agreement document.</strong></p>
            <p style="font-size:0.8rem; margin-top:4px;">${error.message}</p>
          </div>
        `;
      });
  }

  // Pre-process markdown by injecting HTML spans with matching IDs for placeholders
  function injectPlaceholdersIntoMarkdown(text) {
    const gtSignatureHtml = '<span style="font-family: \'Plus Jakarta Sans\', sans-serif; font-size: 0.9rem; font-weight: 600; color: var(--secondary-green); letter-spacing: 0.03em;">[ Digitally Approved ]</span>';
    // 1. Effective date day and month (Flexible underscores support)
    text = text.replace(
      /entered\s+into\s+on\s+this\s+(?:\\_)+\s+day\s+of\s+(?:\\_)+/gi,
      'entered into on this <span id="view-effective-day" class="highlight-placeholder">[ Day ]</span> day of <span id="view-effective-month" class="highlight-placeholder">[ Month ]</span>'
    );

    // 2. GroundTruth Registered Address block
    text = text.replace(
      /having\s+its\s+registered\s+office\s+at\s+,\s+India/gi,
      'having its registered office at <span id="view-gt-address" class="highlight-placeholder">Sneh Kinara, Building No./Flat No.: 41/A/1, B/B Wing, Bopodi, Pune, Maharashtra, India, 411020</span>, India'
    );

    // 3. Facility Owner details block (Flexible backslash-underscores support)
    text = text.replace(
      /\*\*(?:\\_)+\*\*,\s*a\s+company\s+duly\s+incorporated\s+under\s+the\s+laws\s+of\s*(?:\\_)+,\s*having\s+its\s+registered\s+office\s+at\s*(?:\\_)+/gi,
      '**<span id="view-company-name" class="highlight-placeholder">[ Company Name ]</span>**, a company duly incorporated under the laws of <span id="view-jurisdiction" class="highlight-placeholder">[ Jurisdiction ]</span>, having its registered office at <span id="view-company-address" class="highlight-placeholder">[ Registered Office Address ]</span>'
    );

    // 4. SOW details mapping
    text = text.replace(/\*\*SOW Number:\*\*\s*(?:\\_)+/gi, '**SOW Number:** <span id="view-sow-number" class="highlight-placeholder">[ SOW Number ]</span>');
    text = text.replace(/\*\*Project Name:\*\*\s*(?:\\_)+/gi, '**Project Name:** <span id="view-project-name" class="highlight-placeholder">[ Project Name ]</span>');
    text = text.replace(/\*\*Client Name \(if disclosable\):\*\*\s*(?:\\_)+/gi, '**Client Name (if disclosable):** <span id="view-client-name" class="highlight-placeholder">[ Client Name ]</span>');
    text = text.replace(/\*\*GroundTruth Project Manager:\*\*\s*(?:\\_)+/gi, '**GroundTruth Project Manager:** <span id="view-gt-pm" class="highlight-placeholder">[ PM Name ]</span>');
    text = text.replace(/\*\*Facility Representative:\*\*\s*(?:\\_)+/gi, '**Facility Representative:** <span id="view-facility-rep" class="highlight-placeholder">[ Representative Name ]</span>');
    text = text.replace(/\*\*Date of Execution:\*\*\s*(?:\\_)+/gi, '**Date of Execution:** <span id="view-sow-exec-date" class="highlight-placeholder">[ Date of Execution ]</span>');

    // 5. Facility details mapping (SOW Section 2)
    text = text.replace(/Facility Name:/i, 'Facility Name: <span id="view-facility-name" class="highlight-placeholder">[ Facility Name ]</span>');
    text = text.replace(/Facility Address:/i, 'Facility Address: <span id="view-facility-address" class="highlight-placeholder">[ Facility Address ]</span>');
    text = text.replace(/Department \/ Area:/i, 'Department / Area: <span id="view-facility-dept" class="highlight-placeholder">[ Department / Area ]</span>');
    text = text.replace(/Recording Zones:/i, 'Recording Zones: <span id="view-recording-zones" class="highlight-placeholder">[ Recording Zones ]</span>');
    text = text.replace(/Restricted Areas:/i, 'Restricted Areas: <span id="view-restricted-areas" class="highlight-placeholder">[ Restricted Areas ]</span>');
    text = text.replace(/Emergency Assembly Point:/i, 'Emergency Assembly Point: <span id="view-assembly-point" class="highlight-placeholder">[ Emergency Assembly Point ]</span>');
    text = text.replace(/Primary Contact:/i, 'Primary Contact: <span id="view-primary-contact" class="highlight-placeholder">[ Primary Contact ]</span>');
    text = text.replace(/Secondary Contact:/i, 'Secondary Contact: <span id="view-secondary-contact" class="highlight-placeholder">[ Secondary Contact ]</span>');
    text = text.replace(/Emergency Contact Number:/i, 'Emergency Contact Number: <span id="view-emergency-contact" class="highlight-placeholder">[ Emergency Contact Number ]</span>');

    // 6. Special Instructions mapping (SOW Section 9)
    text = text.replace(/## \*\*9\\?\. Special Instructions\*\*\s*---\s*---\s*---\s*---/gi, '## **9. Special Instructions**\n\n<p id="view-special-instructions" class="highlight-placeholder" style="white-space: pre-wrap; min-height: 40px; display: block; padding: 10px;">[ Special Instructions ]</p>');

    // 7. Approvals Section custom anchors & templates
    text = text.replace(/## \*\*10\. Approvals\*\*/g, '<div id="approvals-anchor"></div>\n## **10. Approvals**');

    // Replace GroundTruth main Approvals block (flexible newlines)
    text = text.replace(
      /### \*\*For Batchnorm Technologies LLP\*\*\s*\(Operating as GroundTruth\)\s*\*\*Name:\*\*\s*(?:\\_)+\s*\*\*Designation:\*\*\s*(?:\\_)+\s*\*\*Signature:\*\*\s*(?:\\_)+\s*\*\*Date:\*\*\s*(?:\\_)+/gi,
      `### **For Batchnorm Technologies LLP**\n\n(Operating as GroundTruth)\n\n**Name:** <span id="view-gt-name" class="highlight-placeholder filled">Aman S Goutam</span>\n\n**Designation:** <span id="view-gt-designation" class="highlight-placeholder filled">CEO & Founder</span>\n\n**Signature:** <span id="view-gt-sig-container" class="signature-display-placeholder">${gtSignatureHtml}</span>\n\n**Date:** <span id="view-gt-sig-date" class="highlight-placeholder">June 29, 2026</span>`
    );

    // Replace Facility Owner main Approvals block
    text = text.replace(
      /### \*\*For (?:\\_)+\*\*\s*\(Facility Owner\)\s*\*\*Name:\*\*\s*(?:\\_)+\s*\*\*Designation:\*\*\s*(?:\\_)+\s*\*\*Signature:\*\*\s*(?:\\_)+\s*\*\*Date:\*\*\s*(?:\\_)+/gi,
      '### **For <span id="view-sig-for-title">[ Company Name ]</span>**\n\n(Facility Owner)\n\n**Name:** <span id="view-sig-name" class="highlight-placeholder">[ Signatory Name ]</span>\n\n**Designation:** <span id="view-sig-designation" class="highlight-placeholder">[ Designation ]</span>\n\n**Signature:** <span id="view-sig-image-container" class="signature-display-placeholder"><span class="sig-placeholder-text">Pending Signature</span></span>\n\n**Date:** <span id="view-sig-date" class="highlight-placeholder">[ Date ]</span>'
    );

    // Replace SOW GroundTruth approvals block
    text = text.replace(
      /\*\*GroundTruth\*\*\s*Name:\s*Designation:\s*Signature:\s*Date:/gi,
      `**GroundTruth**\n\nName: <span id="view-sow-gt-name" class="highlight-placeholder filled">Aman S Goutam</span>\n\nDesignation: <span id="view-sow-gt-designation" class="highlight-placeholder filled">CEO & Founder</span>\n\nSignature: <span id="view-sow-gt-sig-container" class="signature-display-placeholder">${gtSignatureHtml}</span>\n\nDate: <span id="view-sow-gt-sig-date" class="highlight-placeholder">June 29, 2026</span>`
    );

    // Replace SOW Facility Owner approvals block
    text = text.replace(
      /\*\*Facility Owner\*\*\s*Name:\s*Designation:\s*Signature:\s*Date:/gi,
      '**Facility Owner (For <span id="view-sow-sig-for-title">[ Company Name ]</span>)**\n\nName: <span id="view-sow-sig-name" class="highlight-placeholder">[ Signatory Name ]</span>\n\nDesignation: <span id="view-sow-sig-designation" class="highlight-placeholder">[ Designation ]</span>\n\nSignature: <span id="view-sow-sig-image-container" class="signature-display-placeholder"><span class="sig-placeholder-text">Pending Signature</span></span>\n\nDate: <span id="view-sow-sig-date" class="highlight-placeholder">[ Date ]</span>'
    );

    // 8. Checkbox replacements (Standard checklists)
    const checkableItems = [
      { label: 'Robotics', id: 'robotics' },
      { label: 'Computer Vision', id: 'computervision' },
      { label: 'Embodied AI', id: 'embodiedai' },
      { label: 'Industrial Automation', id: 'industrialautomation' },
      { label: 'Foundation Models', id: 'foundationmodels' },
      { label: 'Research', id: 'research' },
      { label: 'Head Mounted Camera', id: 'headmounted' },
      { label: 'Body Camera', id: 'bodycamera' },
      { label: 'Smartphone', id: 'smartphone' },
      { label: 'Action Camera', id: 'actioncamera' },
      { label: 'DSLR', id: 'dslr' },
      { label: 'Depth Camera', id: 'depthcamera' },
      { label: 'LiDAR', id: 'lidar' },
      { label: 'Audio Recorder', id: 'audiorecorder' },
      { label: 'IMU', id: 'imu' },
      { label: 'Raw Video', id: 'rawvideo' },
      { label: 'Metadata', id: 'metadata' },
      { label: 'Annotations', id: 'annotations' },
      { label: 'QA Reports', id: 'qareports' },
      { label: 'Benchmark Dataset', id: 'benchmark' },
      { label: 'Evaluation Dataset', id: 'evaluation' },
      { label: 'Fixed Fee', id: 'fixedfee' },
      { label: 'Daily Rate', id: 'dailyrate' },
      { label: 'Hourly', id: 'hourly' },
      { label: 'No Cost Pilot', id: 'nocostpilot' },
      { label: 'Client Sponsored', id: 'clientsponsored' },
      { label: 'Research Collaboration', id: 'collaboration' }
    ];

    checkableItems.forEach(item => {
      const regex = new RegExp(`☐\\s*${item.label}`, 'g');
      text = text.replace(regex, `<span id="view-check-${item.id}" class="sow-checkbox-preview">☐</span> ${item.label}`);
    });

    // Handle "Other" fields robustly using unique boundary identifiers
    text = text.replace(/☐\s*Other\s+(?:\\_)+/gi, '<span id="view-check-domainother" class="sow-checkbox-preview">☐</span> Other <span id="view-domainother-text" class="highlight-placeholder">_________________</span>');
    text = text.replace(/view-check-imu" class="sow-checkbox-preview">☐<\/span> IMU\s*(\r?\n)+\s*☐\s*Other/gi, 'view-check-imu" class="sow-checkbox-preview">☐</span> IMU\n\n<span id="view-check-deviceother" class="sow-checkbox-preview">☐</span> Other <span id="view-deviceother-text" class="highlight-placeholder">_________________</span>');
    text = text.replace(/view-check-evaluation" class="sow-checkbox-preview">☐<\/span> Evaluation Dataset\s*(\r?\n)+\s*☐\s*Other/gi, 'view-check-evaluation" class="sow-checkbox-preview">☐</span> Evaluation Dataset\n\n<span id="view-check-dataother" class="sow-checkbox-preview">☐</span> Other <span id="view-dataother-text" class="highlight-placeholder">_________________</span>');

    return text;
  }

  // Populate read-only view on share url bootup
  function updateReadOnlyDocumentView() {
    const updateReadOnlySpan = (spanId, val) => {
      const el = document.getElementById(spanId);
      if (el && val) {
        el.textContent = val;
        el.classList.add('filled');
      }
    };

    updateReadOnlySpan('view-company-name', state.companyName);
    updateReadOnlySpan('view-jurisdiction', state.jurisdiction);
    updateReadOnlySpan('view-effective-day', state.effectiveDay);
    updateReadOnlySpan('view-effective-month', state.effectiveMonth);
    updateReadOnlySpan('view-company-address', state.registeredAddress);
    updateReadOnlySpan('view-gt-address', state.gtAddress);

    // SOW text views
    updateReadOnlySpan('view-sow-number', state.sowNumber);
    updateReadOnlySpan('view-project-name', state.projectName);
    updateReadOnlySpan('view-client-name', state.clientName);
    updateReadOnlySpan('view-sow-exec-date', state.sowExecDate);
    updateReadOnlySpan('view-gt-pm', state.gtPm);
    updateReadOnlySpan('view-facility-rep', state.facilityRep);

    // Facility Details
    updateReadOnlySpan('view-facility-name', state.facilityName);
    updateReadOnlySpan('view-facility-address', state.facilityAddress);
    updateReadOnlySpan('view-facility-dept', state.facilityDept);
    updateReadOnlySpan('view-recording-zones', state.recordingZones);
    updateReadOnlySpan('view-restricted-areas', state.restrictedAreas);
    updateReadOnlySpan('view-assembly-point', state.assemblyPoint);
    updateReadOnlySpan('view-primary-contact', state.primaryContact);
    updateReadOnlySpan('view-secondary-contact', state.secondaryContact);
    updateReadOnlySpan('view-emergency-contact', state.emergencyContact);
    
    // Special instructions
    if (state.specialInstructions) {
      const el = document.getElementById('view-special-instructions');
      if (el) {
        el.textContent = state.specialInstructions;
        el.classList.add('filled');
      }
    }

    // Signatures
    const names = ['view-sig-name', 'view-sow-sig-name'];
    names.forEach(tid => updateReadOnlySpan(tid, state.signatoryName));

    const designations = ['view-sig-designation', 'view-sow-sig-designation'];
    designations.forEach(tid => updateReadOnlySpan(tid, state.signatoryDesignation));

    const forTitles = ['view-sig-for-title', 'view-sow-sig-for-title'];
    forTitles.forEach(tid => {
      const el = document.getElementById(tid);
      if (el) el.textContent = state.companyName || '[ Company Name ]';
    });

    const dates = ['view-sig-date', 'view-gt-sig-date', 'view-sow-sig-date', 'view-sow-gt-sig-date'];
    dates.forEach(tid => updateReadOnlySpan(tid, state.executionDate));

    // Checkboxes sync
    checkboxIds.forEach(cid => {
      const stateKey = cid.replace('-', '_');
      const viewId = `view-check-${cid.replace('chk-', '')}`;
      const viewSpan = document.getElementById(viewId);
      if (viewSpan) {
        const isChecked = state[stateKey];
        viewSpan.textContent = isChecked ? '☑' : '☐';
        if (isChecked) viewSpan.style.color = 'var(--secondary-green)';
      }
    });

    // Checkboxes Other text
    if (state.txt_domainother) {
      document.getElementById('view-domainother-text').textContent = `(${state.txt_domainother})`;
      document.getElementById('view-domainother-text').classList.add('filled');
    }
    if (state.txt_deviceother) {
      document.getElementById('view-deviceother-text').textContent = `(${state.txt_deviceother})`;
      document.getElementById('view-deviceother-text').classList.add('filled');
    }
    if (state.txt_dataother) {
      document.getElementById('view-dataother-text').textContent = `(${state.txt_dataother})`;
      document.getElementById('view-dataother-text').classList.add('filled');
    }

    updateDocSignaturePreview();
    
    // Auto go to step 3 layout
    setStep(3);
  }

  // Populate document view from cached state
  function updateDocumentViewFromState() {
    const updateSpan = (spanId, val, fallback) => {
      const el = document.getElementById(spanId);
      if (el) {
        if (val && val.trim()) {
          el.textContent = val;
          el.classList.add('filled');
        } else {
          el.textContent = fallback;
          el.classList.remove('filled');
        }
      }
    };

    updateSpan('view-company-name', state.companyName, '[ Company Name ]');
    updateSpan('view-jurisdiction', state.jurisdiction, '[ Jurisdiction ]');
    updateSpan('view-effective-day', state.effectiveDay, '[ Day ]');
    updateSpan('view-effective-month', state.effectiveMonth, '[ Month ]');
    updateSpan('view-company-address', state.registeredAddress, '[ Registered Office Address ]');
    updateSpan('view-gt-address', state.gtAddress, 'Sneh Kinara, Pune');

    updateSpan('view-sow-number', state.sowNumber, '[ SOW Number ]');
    updateSpan('view-project-name', state.projectName, '[ Project Name ]');
    updateSpan('view-client-name', state.clientName, '[ Client Name ]');
    updateSpan('view-sow-exec-date', state.sowExecDate, '[ Date of Execution ]');
    updateSpan('view-gt-pm', state.gtPm, '[ PM Name ]');
    updateSpan('view-facility-rep', state.facilityRep, '[ Representative Name ]');

    // SOW Facility details
    updateSpan('view-facility-name', state.facilityName, '[ Facility Name ]');
    updateSpan('view-facility-address', state.facilityAddress, '[ Facility Address ]');
    updateSpan('view-facility-dept', state.facilityDept, '[ Department / Area ]');
    updateSpan('view-recording-zones', state.recordingZones, '[ Recording Zones ]');
    updateSpan('view-restricted-areas', state.restrictedAreas, '[ Restricted Areas ]');
    updateSpan('view-assembly-point', state.assemblyPoint, '[ Emergency Assembly Point ]');
    updateSpan('view-primary-contact', state.primaryContact, '[ Primary Contact ]');
    updateSpan('view-secondary-contact', state.secondaryContact, '[ Secondary Contact ]');
    updateSpan('view-emergency-contact', state.emergencyContact, '[ Emergency Contact Number ]');
    
    // Special Instructions
    updateSpan('view-special-instructions', state.specialInstructions, '[ Special Instructions ]');

    const sigNames = ['view-sig-name', 'view-sow-sig-name'];
    sigNames.forEach(tid => updateSpan(tid, state.signatoryName, '[ Signatory Name ]'));

    const sigTitles = ['view-sig-designation', 'view-sow-sig-designation'];
    sigTitles.forEach(tid => updateSpan(tid, state.signatoryDesignation, '[ Designation ]'));
    
    const forTitles = ['view-sig-for-title', 'view-sow-sig-for-title'];
    forTitles.forEach(tid => {
      const el = document.getElementById(tid);
      if (el) el.textContent = state.companyName || '[ Company Name ]';
    });

    // Checkboxes sync
    checkboxIds.forEach(cid => {
      const stateKey = cid.replace('-', '_');
      const viewId = `view-check-${cid.replace('chk-', '')}`;
      const viewSpan = document.getElementById(viewId);
      if (viewSpan) {
        const isChecked = state[stateKey];
        viewSpan.textContent = isChecked ? '☑' : '☐';
        if (isChecked) viewSpan.style.color = 'var(--secondary-green)';
      }
    });

    // Checkboxes Other texts
    updateSpan('view-domainother-text', state.txt_domainother ? `(${state.txt_domainother})` : '', '');
    updateSpan('view-deviceother-text', state.txt_deviceother ? `(${state.txt_deviceother})` : '', '');
    updateSpan('view-dataother-text', state.txt_dataother ? `(${state.txt_dataother})` : '', '');

    updateDocSignaturePreview();
  }

  // --- Scroll-to-Top Floating Button Logic ---
  const docContainer = document.querySelector('.document-container');
  const btnScrollToTop = document.getElementById('btnScrollToTop');

  if (docContainer && btnScrollToTop) {
    docContainer.addEventListener('scroll', () => {
      if (docContainer.scrollTop > 200) {
        btnScrollToTop.classList.add('visible');
      } else {
        btnScrollToTop.classList.remove('visible');
      }
    });

    btnScrollToTop.addEventListener('click', () => {
      docContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- Initial Page Bootstrapping ---
  
  const isUrlStateLoaded = loadStateFromUrl();
  
  if (!isUrlStateLoaded) {
    loadFromLocalStorage();
    setStep(1);
  }

  fetchAndRenderAgreement();
});
