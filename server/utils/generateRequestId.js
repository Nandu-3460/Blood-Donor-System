/**
 * Generates a human-friendly unique Blood Request ID
 * Example: BR-2026-98421
 */
function generateRequestId() {
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `BR-${timestamp}-${random}`;
}

module.exports = generateRequestId;
