// Layman Document Simplifier - 90s Style Web App
class LaymanApp {
    constructor() {
        this.currentFile = null;
        this.documentHistory = this.loadHistory();
        this.documentCount = this.documentHistory.length;
        
        this.init();
    }

    init() {
        this.setupClock();
        this.setupFileUpload();
        this.setupUI();
        this.updateStatus('Ready - Drag a document to get started');
    }

    // Clock functionality for taskbar
    setupClock() {
        const updateClock = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            });
            document.getElementById('clock').textContent = timeString;
        };
        
        updateClock();
        setInterval(updateClock, 1000);
    }

    // File upload and drag/drop functionality
    setupFileUpload() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const browseBtn = document.getElementById('browseBtn');

        // Drag and drop handlers
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });

        // Click to browse
        browseBtn.addEventListener('click', () => {
            fileInput.click();
        });

        uploadArea.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFile(e.target.files[0]);
            }
        });
    }

    // UI event handlers
    setupUI() {
        // Window controls (mostly cosmetic)
        document.querySelector('.minimize').addEventListener('click', () => {
            this.showMessage('Minimize functionality not available in web version');
        });

        document.querySelector('.maximize').addEventListener('click', () => {
            const mainWindow = document.querySelector('.main-window');
            mainWindow.classList.toggle('maximized');
        });

        document.querySelector('.close').addEventListener('click', () => {
            if (confirm('Are you sure you want to close Layman?')) {
                window.close();
            }
        });

        // Result actions
        document.getElementById('downloadBtn')?.addEventListener('click', () => {
            this.downloadSummary();
        });

        document.getElementById('newDocBtn')?.addEventListener('click', () => {
            this.resetForNewDocument();
        });

        // About dialog
        document.getElementById('aboutClose')?.addEventListener('click', () => {
            document.getElementById('aboutDialog').style.display = 'none';
        });

        // Menu items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const menuText = e.target.textContent;
                if (menuText === 'Help') {
                    document.getElementById('aboutDialog').style.display = 'block';
                } else {
                    this.showMessage(`${menuText} menu not implemented in this demo`);
                }
            });
        });

        // Update document count
        document.getElementById('docCount').textContent = this.documentCount;
    }

    // File handling
    async handleFile(file) {
        if (!this.isValidFile(file)) {
            this.showMessage('Please select a valid PDF or image file (JPG, PNG, GIF)');
            return;
        }

        this.currentFile = file;
        this.updateStatus(`Processing ${file.name}...`);
        this.showProcessingSection();

        try {
            // Start processing
            await this.processDocument(file);
        } catch (error) {
            console.error('Error processing file:', error);
            this.showMessage('Error processing file. Please try again.');
            this.resetForNewDocument();
        }
    }

    isValidFile(file) {
        const validTypes = [
            'application/pdf',
            'image/jpeg',
            'image/jpg', 
            'image/png',
            'image/gif'
        ];
        return validTypes.includes(file.type);
    }

    async processDocument(file) {
        // Show processing section
        this.hideSection('upload-section');
        this.showSection('processing-section');

        // Simulate processing steps
        const steps = [
            { text: 'Reading document...', progress: 20 },
            { text: 'Extracting text...', progress: 40 },
            { text: 'Analyzing content...', progress: 60 },
            { text: 'Generating summary...', progress: 80 },
            { text: 'Finalizing...', progress: 100 }
        ];

        for (let i = 0; i < steps.length; i++) {
            await this.updateProgress(steps[i].text, steps[i].progress);
            await this.delay(800 + Math.random() * 400); // Random delay for realism
        }

        // Extract text based on file type
        let extractedText = '';
        if (file.type === 'application/pdf') {
            extractedText = await this.extractTextFromPDF(file);
        } else {
            extractedText = await this.extractTextFromImage(file);
        }

        // Generate summary
        const summary = await this.generateSummary(extractedText, file.name);
        
        // Display results
        this.displayResults(summary);
        
        // Save to history
        this.saveToHistory(file.name, summary);
        
        this.updateStatus(`Document processed successfully`);
    }

    async extractTextFromPDF(file) {
        // In a real implementation, you'd use PDF.js or similar library
        // For demo purposes, return mock text
        await this.delay(1000);
        
        return `NOTICE OF BENEFIT DETERMINATION
        
        Dear Member,
        
        We have reviewed your recent claim for medical services dated March 15, 2024. After careful consideration of your submitted documentation and policy terms, we have made the following determination:
        
        CLAIM STATUS: APPROVED
        Claim Number: CLM-2024-0089123
        Service Date: March 15, 2024
        Provider: Dr. Sarah Johnson, MD
        Service Description: Annual Physical Examination
        
        PAYMENT INFORMATION:
        Total Charge: $250.00
        Covered Amount: $200.00
        Your Deductible: $0.00
        Your Copayment: $25.00
        Amount Paid to Provider: $175.00
        Your Responsibility: $25.00
        
        EXPLANATION:
        This service is covered under your preventive care benefits with no deductible applied. You are responsible for the standard copayment of $25.00 as outlined in your policy.
        
        If you have questions about this determination, please contact Member Services at 1-800-HEALTH1 within 60 days of receiving this notice. You have the right to appeal this decision if you disagree.
        
        Thank you for choosing HealthFirst Insurance.
        
        Sincerely,
        Claims Review Department
        HealthFirst Insurance Company`;
    }

    async extractTextFromImage(file) {
        // In a real implementation, you'd use Tesseract.js or similar OCR library
        // For demo purposes, return mock text based on common document types
        await this.delay(1500);
        
        const mockTexts = [
            `FINAL NOTICE
            
            Account Number: 1234567890
            Due Date: April 30, 2024
            Amount Due: $156.78
            
            Your payment is now 30 days past due. To avoid service interruption, please remit payment immediately. You can pay online at www.utilitycompany.com or call 1-800-PAY-BILL.
            
            If payment is not received by May 15, 2024, service may be discontinued and a reconnection fee of $75 will apply.`,
            
            `LOAN MODIFICATION APPROVAL
            
            Dear Borrower,
            
            We are pleased to inform you that your request for loan modification has been APPROVED. Your new payment terms are as follows:
            
            New Monthly Payment: $1,247.83
            Interest Rate: 3.25% (Fixed)
            Effective Date: May 1, 2024
            
            Please sign and return the enclosed documents within 30 days to finalize this modification.`,
            
            `TAX ASSESSMENT NOTICE
            
            Property ID: 789-456-123
            Assessment Year: 2024
            Previous Assessment: $245,000
            New Assessment: $267,500
            
            Your property tax bill will be mailed separately. If you disagree with this assessment, you may appeal within 45 days.`
        ];
        
        return mockTexts[Math.floor(Math.random() * mockTexts.length)];
    }

    async generateSummary(text, filename) {
        // In a real implementation, this would call an AI API like OpenAI or Claude
        // For demo purposes, generate contextual summaries based on document content
        await this.delay(2000);
        
        const lowerText = text.toLowerCase();
        
        let summary = {
            whatItSays: '',
            whatItMeans: '', 
            whatToDo: ''
        };

        // Medical/Insurance documents
        if (lowerText.includes('claim') && lowerText.includes('benefit')) {
            summary.whatItSays = "This is a notice from your health insurance company about a medical claim you submitted. They reviewed your claim for an annual physical exam and have approved it for payment.";
            summary.whatItMeans = "Good news! Your insurance covered most of your doctor visit. They paid the doctor $175 directly, and you only owe a $25 copayment. This is normal for preventive care visits.";
            summary.whatToDo = "• Pay the $25 copayment to your doctor if you haven't already\n• Keep this notice for your records\n• No other action needed - your claim was approved";
        }
        // Utility bills
        else if (lowerText.includes('past due') || lowerText.includes('final notice')) {
            summary.whatItSays = "This is a final notice from your utility company saying your bill is 30 days overdue. The amount owed is $156.78 and service may be disconnected if not paid by May 15, 2024.";
            summary.whatItMeans = "Your electricity/gas/water bill is late and they're warning you about shutting off service. There's also a $75 fee if they have to reconnect after disconnection.";
            summary.whatToDo = "• Pay $156.78 immediately to avoid service disconnection\n• Use their website or call 1-800-PAY-BILL\n• Set up autopay to avoid future late payments\n• Contact them if you need a payment plan";
        }
        // Loan modifications
        else if (lowerText.includes('loan') && lowerText.includes('modification')) {
            summary.whatItSays = "Your bank approved your request to modify your loan terms. Your new monthly payment will be $1,247.83 with a 3.25% fixed interest rate, starting May 1, 2024.";
            summary.whatItMeans = "Great news! Your bank agreed to change your loan to make it more affordable. This usually means lower monthly payments or better interest rates to help you avoid foreclosure.";
            summary.whatToDo = "• Sign and return the enclosed documents within 30 days\n• Start making the new payment amount ($1,247.83) on May 1st\n• Keep all paperwork for your records\n• Contact your bank if you have questions";
        }
        // Tax assessments
        else if (lowerText.includes('tax') && lowerText.includes('assessment')) {
            summary.whatItSays = "The county assessed your property value at $267,500 for 2024, which is an increase from last year's $245,000. Your property tax bill will be calculated based on this new value.";
            summary.whatItMeans = "Your home's official value went up by $22,500, which means your property taxes will likely increase. This assessment affects how much tax you'll pay.";
            summary.whatToDo = "• Wait for your actual tax bill to see the dollar impact\n• If you think the assessment is too high, you can appeal within 45 days\n• Start budgeting for potentially higher property taxes\n• Consider setting aside money monthly for tax payments";
        }
        // Generic fallback
        else {
            summary.whatItSays = "This appears to be a formal document with legal or financial implications. It contains important information about your account, services, or benefits.";
            summary.whatItMeans = "This document requires your attention and may affect your finances or legal standing. It's important to read through it carefully.";
            summary.whatToDo = "• Read the full document carefully\n• Note any deadlines or required actions\n• Contact the sender if you have questions\n• Keep the document for your records";
        }

        return summary;
    }

    displayResults(summary) {
        this.hideSection('processing-section');
        this.showSection('results-section');
        
        document.getElementById('whatItSays').textContent = summary.whatItSays;
        document.getElementById('whatItMeans').textContent = summary.whatItMeans;
        document.getElementById('whatToDo').textContent = summary.whatToDo;
    }

    saveToHistory(filename, summary) {
        const historyItem = {
            id: Date.now(),
            filename: filename,
            date: new Date().toLocaleDateString(),
            summary: summary
        };
        
        this.documentHistory.unshift(historyItem);
        
        // Keep only last 10 items
        if (this.documentHistory.length > 10) {
            this.documentHistory = this.documentHistory.slice(0, 10);
        }
        
        localStorage.setItem('laymanHistory', JSON.stringify(this.documentHistory));
        this.documentCount++;
        document.getElementById('docCount').textContent = this.documentCount;
    }

    loadHistory() {
        try {
            const saved = localStorage.getItem('laymanHistory');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    }

    downloadSummary() {
        const summary = {
            whatItSays: document.getElementById('whatItSays').textContent,
            whatItMeans: document.getElementById('whatItMeans').textContent,
            whatToDo: document.getElementById('whatToDo').textContent
        };
        
        const content = `LAYMAN DOCUMENT SUMMARY
Generated: ${new Date().toLocaleString()}
Document: ${this.currentFile?.name || 'Unknown'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📄 WHAT IT SAYS:
${summary.whatItSays}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧠 WHAT IT MEANS:
${summary.whatItMeans}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ WHAT YOU NEED TO DO:
${summary.whatToDo}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Generated by Layman Document Simplifier v1.0
Making legal documents understandable since 2025!`;

        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `layman-summary-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showMessage('Summary downloaded successfully!');
    }

    resetForNewDocument() {
        this.currentFile = null;
        this.hideSection('results-section');
        this.hideSection('processing-section');
        this.showSection('upload-section');
        this.updateStatus('Ready - Drag a document to get started');
        
        // Reset file input
        document.getElementById('fileInput').value = '';
    }

    // Utility methods
    showSection(sectionClass) {
        const section = document.querySelector(`.${sectionClass}`);
        if (section) section.style.display = 'block';
    }

    hideSection(sectionClass) {
        const section = document.querySelector(`.${sectionClass}`);
        if (section) section.style.display = 'none';
    }

    showProcessingSection() {
        this.hideSection('upload-section');
        this.showSection('processing-section');
    }

    async updateProgress(text, percentage) {
        document.getElementById('progressText').textContent = text;
        document.getElementById('progressFill').style.width = percentage + '%';
        return this.delay(100);
    }

    updateStatus(message) {
        document.getElementById('statusText').textContent = message;
    }

    showMessage(message) {
        // Create a simple alert-style dialog
        const dialog = document.createElement('div');
        dialog.className = 'dialog';
        dialog.style.display = 'block';
        dialog.innerHTML = `
            <div class="window-titlebar">
                <div class="window-title">Layman</div>
                <div class="window-controls">
                    <button class="control-btn close">×</button>
                </div>
            </div>
            <div class="dialog-content">
                <p style="margin-bottom: 16px;">${message}</p>
                <div class="dialog-buttons">
                    <button class="retro-btn">OK</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
        
        // Close handlers
        const closeDialog = () => dialog.remove();
        dialog.querySelector('.close').addEventListener('click', closeDialog);
        dialog.querySelector('.retro-btn').addEventListener('click', closeDialog);
        
        // Auto-close after 3 seconds
        setTimeout(closeDialog, 3000);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.laymanApp = new LaymanApp();
});

// Prevent default drag behaviors on the whole page
document.addEventListener('dragover', e => e.preventDefault());
document.addEventListener('drop', e => e.preventDefault());