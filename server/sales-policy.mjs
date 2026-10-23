// Price selection is determined by authorised server context, never request totals.
// Retail remains disabled in this release even if a browser alters a flag.
export const RETAIL_IMPLEMENTED = false;
export function unitPrice(variant, segment = 'wholesale', settings = {}) {
 if (!['wholesale', 'retail'].includes(segment)) throw Error('Invalid customer segment.');
 if (segment === 'retail' && (!RETAIL_IMPLEMENTED || !settings.retail_enabled)) throw Error('Retail sales are not enabled.');
 const raw = segment === 'wholesale' ? variant.professional_price : variant.retail_price;
 if (raw === null || raw === undefined || raw === '' || !Number.isFinite(Number(raw)) || Number(raw) < 0) throw Error('Price is not configured.');
 return Number(raw);
}
