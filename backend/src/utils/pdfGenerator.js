const PDFDocument = require("pdfkit");

const generateMedicalHistoryPDF = (patient, records, res) => {
    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=${patient.user.name}_medical_history.pdf`
    );

    doc.pipe(res);

    doc.fontSize(18).text("Medical History", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Patient Name: ${patient.user.name}`);
    doc.text(`Email: ${patient.user.email}`);
    doc.text(`Gender: ${patient.gender}`);
    doc.text(`DOB: ${patient.dob.toDateString()}`);
    doc.moveDown();

    records.forEach((record, index) => {
        doc
            .fontSize(14)
            .text(`Record ${index + 1}`, { underline: true });
        doc.fontSize(12).text(`Diagnosis: ${record.diagnosis}`);
        doc.text(`Treatment: ${record.treatmentPlan}`);
        doc.text(`Medications: ${record.medications.join(", ")}`);
        doc.text(`Notes: ${record.notes || "N/A"}`);
        doc.moveDown();
    });

    doc.end();
};

module.exports = generateMedicalHistoryPDF;