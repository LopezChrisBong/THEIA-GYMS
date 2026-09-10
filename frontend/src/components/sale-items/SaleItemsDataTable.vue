<template>
  <v-container fluid class="theia-view">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <div class="page-heading">Sale Items</div>
        <div class="page-sub">View recorded sale line items</div>
      </div>
      <div class="header-actions">
        <div class="search-wrap">
          <v-icon size="14" color="#9A7858">mdi-magnify</v-icon>
          <input v-model="search" type="text" placeholder="Search sale items..." class="search-input-proto" />
        </div>
      </div>
    </div>

    <!-- Table Card -->
    <div class="cust-table-card">
      <div class="filter-row">
        <div class="filter-spacer" />
        <div class="per-pg">
          Items per page:
          <select v-model="perPage" @change="page = 1">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>

      <div class="tbl-wrap">
        <table class="cust-table" v-if="!loading">
          <thead>
            <tr>
              <th @click="sortBy('saleNumber')">Sale #</th>
              <th @click="sortBy('itemCode')">Jewelry Item</th>
              <th @click="sortBy('unitPrice')">Unit Price</th>
              <th @click="sortBy('discountAmount')">Discount</th>
              <th @click="sortBy('lineTotal')">Line Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in paginatedData" :key="item.id">
              <td>
                <span v-if="item.sale" class="mono">{{ item.sale.saleNumber }}</span>
                <span v-else class="dim">—</span>
              </td>
              <td>
                <span v-if="item.jewelryItem">
                  <span class="mono">{{ item.jewelryItem.itemCode }}</span>
                  <span v-if="item.jewelryItem.name" class="dim" style="margin-left:6px">{{ item.jewelryItem.name }}</span>
                </span>
                <span v-else class="dim">—</span>
              </td>
              <td class="amount-col">₱{{ formatNumber(item.unitPrice) }}</td>
              <td>
                <span v-if="Number(item.discountAmount) > 0" class="repeat-badge r-discount">- ₱{{ formatNumber(item.discountAmount) }}</span>
                <span v-else class="dim">—</span>
              </td>
              <td class="amount-col">₱{{ formatNumber(item.lineTotal) }}</td>
              <td>
                <div class="act-btns">
                  <button class="act-btn view-btn" title="View" @click="viewItem(item)">
                    <v-icon size="14">mdi-eye-outline</v-icon>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredData.length === 0">
              <td colspan="6">
                <div class="empty-state">
                  <div class="empty-icon">
                    <v-icon size="20" color="#9B6B3A">mdi-cart-outline</v-icon>
                  </div>
                  <div class="empty-title">No sale items found</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="loading" class="empty-state">
          <v-progress-circular indeterminate color="#9B6B3A" size="32" />
          <div class="empty-title">Loading sale items...</div>
        </div>
      </div>

      <!-- Pagination -->
      <div class="cust-pagination" v-if="filteredData.length > 0">
        <div class="pg-info">Showing {{ pgStart }}–{{ pgEnd }} of {{ filteredData.length }}</div>
        <div class="pg-btns">
          <button class="pg-btn" :disabled="page <= 1" @click="page = 1">&laquo;</button>
          <button class="pg-btn" :disabled="page <= 1" @click="page--">&lsaquo;</button>
          <button v-for="p in visiblePages" :key="p" class="pg-btn" :class="{ cur: p === page }" @click="page = p">{{ p }}</button>
          <button class="pg-btn" :disabled="page >= totalPages" @click="page++">&rsaquo;</button>
          <button class="pg-btn" :disabled="page >= totalPages" @click="page = totalPages">&raquo;</button>
        </div>
      </div>
    </div>

    <!-- View Sale Item Modal -->
    <v-dialog v-model="dialogView" max-width="480px">
      <v-card v-if="viewData" class="sale-view-card">
        <div class="sv-header">
          <div>
            <div class="sv-title">
              <v-icon size="16" color="#9B6B3A" style="margin-right:8px">mdi-cart-outline</v-icon>
              Sale Item Details
            </div>
            <div class="sv-sub mono">{{ viewData.jewelryItem?.itemCode || '—' }}</div>
          </div>
          <button class="sv-close" @click="dialogView = false">
            <v-icon size="18">mdi-close</v-icon>
          </button>
        </div>

        <div class="sv-body">
          <div class="sv-section">
            <div class="sv-row">
              <span class="sv-lbl">Sale #</span>
              <span class="sv-val mono">{{ viewData.sale?.saleNumber || '—' }}</span>
            </div>
            <div class="sv-row" v-if="viewData.sale?.saleDate">
              <span class="sv-lbl">Sale Date</span>
              <span class="sv-val">{{ formatDateTime(viewData.sale.saleDate) }}</span>
            </div>
            <div class="sv-row">
              <span class="sv-lbl">Item Code</span>
              <span class="sv-val mono">{{ viewData.jewelryItem?.itemCode || '—' }}</span>
            </div>
            <div class="sv-row">
              <span class="sv-lbl">Name</span>
              <span class="sv-val">{{ viewData.jewelryItem?.name || '—' }}</span>
            </div>
            <div class="sv-row" v-if="viewData.jewelryItem?.barcode">
              <span class="sv-lbl">Barcode</span>
              <span class="sv-val mono">{{ viewData.jewelryItem.barcode }}</span>
            </div>
          </div>

          <div class="sv-divider"></div>
          <div class="sv-section-title">Pricing</div>
          <div class="sv-section">
            <div class="sv-row">
              <span class="sv-lbl">Unit Price</span>
              <span class="sv-val">₱{{ formatNumber(viewData.unitPrice) }}</span>
            </div>
            <div class="sv-row" v-if="Number(viewData.discountAmount) > 0">
              <span class="sv-lbl">Discount</span>
              <span class="sv-val sv-discount">- ₱{{ formatNumber(viewData.discountAmount) }}</span>
            </div>
            <div class="sv-row" v-if="viewData.unitCost != null">
              <span class="sv-lbl">Unit Cost</span>
              <span class="sv-val">₱{{ formatNumber(viewData.unitCost) }}</span>
            </div>
            <div class="sv-row" v-if="viewData.grossMargin != null">
              <span class="sv-lbl">Gross Margin</span>
              <span class="sv-val">₱{{ formatNumber(viewData.grossMargin) }}</span>
            </div>
          </div>

          <div class="sv-total-row">
            <span>LINE TOTAL</span>
            <span class="sv-total-amt">₱{{ formatNumber(viewData.lineTotal) }}</span>
          </div>
        </div>
      </v-card>
    </v-dialog>

    <fade-away-message-component
      displayType="variation2"
      v-model="fadeAwayMessage.show"
      :message="fadeAwayMessage.message"
      :header="fadeAwayMessage.header"
      :top="fadeAwayMessage.top"
      :type="fadeAwayMessage.type"
    />
  </v-container>
</template>

<script>
export default {
  name: "SaleItemsDataTable",
  data: () => ({
    search: "",
    page: 1,
    perPage: 10,
    sortKey: "id",
    sortDir: "desc",
    data: [],
    loading: false,
    dialogView: false,
    viewData: null,
    fadeAwayMessage: { show: false, type: "success", header: "Success", message: "", top: 10 },
  }),

  computed: {
    filteredData() {
      let result = [...this.data];

      if (this.search) {
        const q = this.search.toLowerCase();
        result = result.filter((it) =>
          [it.sale?.saleNumber, it.jewelryItem?.itemCode, it.jewelryItem?.name]
            .filter(Boolean)
            .some((f) => String(f).toLowerCase().includes(q))
        );
      }

      result.sort((a, b) => {
        let va = this.sortValue(a, this.sortKey);
        let vb = this.sortValue(b, this.sortKey);
        if (va == null) va = "";
        if (vb == null) vb = "";
        if (typeof va === "string") va = va.toLowerCase();
        if (typeof vb === "string") vb = vb.toLowerCase();
        if (va < vb) return this.sortDir === "asc" ? -1 : 1;
        if (va > vb) return this.sortDir === "asc" ? 1 : -1;
        return 0;
      });

      return result;
    },
    totalPages() { return Math.max(1, Math.ceil(this.filteredData.length / this.perPage)); },
    paginatedData() { const s = (this.page - 1) * this.perPage; return this.filteredData.slice(s, s + this.perPage); },
    pgStart() { return Math.min((this.page - 1) * this.perPage + 1, this.filteredData.length); },
    pgEnd() { return Math.min(this.page * this.perPage, this.filteredData.length); },
    visiblePages() {
      const p = [];
      const s = Math.max(1, this.page - 2);
      for (let i = s; i <= Math.min(this.totalPages, s + 4); i++) p.push(i);
      return p;
    },
  },

  mounted() {
    this.initialize();
  },

  methods: {
    sortBy(key) {
      if (this.sortKey === key) this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
      else { this.sortKey = key; this.sortDir = "asc"; }
    },

    sortValue(item, key) {
      if (key === "saleNumber") return item.sale?.saleNumber;
      if (key === "itemCode") return item.jewelryItem?.itemCode;
      return item[key];
    },

    formatNumber(v) {
      if (v == null) return "0.00";
      return Number(v).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },

    formatDateTime(d) {
      if (!d) return "—";
      return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    },

    initialize() {
      this.loading = true;
      this.axiosCall("/sale-items", "GET")
        .then((res) => { if (res?.data) this.data = res.data; })
        .catch(() => { this.fadeAwayMessage = { show: true, type: "error", header: "Error", message: "Failed to load sale items", top: 10 }; })
        .finally(() => { this.loading = false; });
    },

    viewItem(item) {
      this.viewData = item;
      this.dialogView = true;
    },
  },
};
</script>

<style scoped>
.theia-view { font-family: 'Outfit', sans-serif; color: #3A2515; position: relative; z-index: 1; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 18px; }
.page-heading { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 500; color: #3A2515; letter-spacing: 0.02em; }
.page-sub { font-size: 12px; color: #9A7858; margin-top: 2px; }
.header-actions { display: flex; align-items: center; gap: 10px; }
.search-wrap { display: flex; align-items: center; gap: 8px; background: #FDFAF6; border: 1px solid rgba(155,107,58,0.16); border-radius: 9px; padding: 8px 13px; box-shadow: 0 1px 6px rgba(80,30,10,0.08); min-width: 210px; }
.search-input-proto { border: none; background: none; outline: none; font-size: 13px; font-family: 'Outfit', sans-serif; color: #3A2515; width: 100%; }
.search-input-proto::placeholder { color: #9A7858; }

.cust-table-card { background: #FDFAF6; border: 1px solid rgba(155,107,58,0.16); border-radius: 16px; box-shadow: 0 2px 14px rgba(80,30,10,0.08); overflow: hidden; }
.filter-row { display: flex; align-items: center; gap: 8px; padding: 12px 18px; border-bottom: 1px solid rgba(155,107,58,0.16); background: #F5EFE4; flex-wrap: wrap; }
.filter-spacer { flex: 1; }
.per-pg { display: flex; align-items: center; gap: 7px; font-size: 12px; color: #9A7858; }
.per-pg select { border: 1px solid rgba(155,107,58,0.16); border-radius: 7px; background: #FDFAF6; color: #3A2515; font-family: 'Outfit', sans-serif; font-size: 12px; padding: 4px 8px; outline: none; cursor: pointer; }

.tbl-wrap { overflow-x: auto; }
.cust-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 680px; }
.cust-table thead th { text-align: left; padding: 10px 16px; font-size: 10px; letter-spacing: 0.13em; text-transform: uppercase; color: #9A7858; font-weight: 600; background: #F5EFE4; white-space: nowrap; cursor: pointer; user-select: none; }
.cust-table thead th:hover { color: #9B6B3A; }
.cust-table tbody tr { border-top: 1px solid rgba(155,107,58,0.16); transition: background 0.1s; }
.cust-table tbody tr:hover { background: #EDE0CC; }
.cust-table tbody td { padding: 11px 16px; color: #3A2515; white-space: nowrap; vertical-align: middle; }
.mono { font-family: monospace; font-size: 12px; color: #9B6B3A; font-weight: 600; }
.dim { color: #9A7858; font-size: 12px; }
.amount-col { font-weight: 600; color: #9B6B3A; }

.repeat-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; }
.r-discount { background: rgba(184,64,64,0.08); color: #B84040; }

.act-btns { display: flex; align-items: center; gap: 4px; }
.act-btn { width: 27px; height: 27px; border-radius: 7px; border: 1px solid rgba(155,107,58,0.16); background: #F5EFE4; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.12s; color: #9A7858; }
.act-btn.view-btn:hover { border-color: #5A7A9B; color: #5A7A9B; background: rgba(90,122,155,0.06); }

.cust-pagination { display: flex; align-items: center; justify-content: space-between; padding: 11px 18px; border-top: 1px solid rgba(155,107,58,0.16); background: #F5EFE4; }
.pg-info { font-size: 12px; color: #9A7858; }
.pg-btns { display: flex; align-items: center; gap: 3px; }
.pg-btn { width: 28px; height: 28px; border-radius: 7px; border: 1px solid rgba(155,107,58,0.16); background: #FDFAF6; color: #9A7858; font-size: 13px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.12s; font-family: 'Outfit', sans-serif; }
.pg-btn:hover:not([disabled]) { border-color: #C49455; color: #9B6B3A; background: #EDE0CC; }
.pg-btn[disabled] { opacity: 0.3; cursor: default; }
.pg-btn.cur { background: #9B6B3A; color: #FDFAF6; border-color: #9B6B3A; font-weight: 600; }

.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 52px 20px; gap: 10px; color: #9A7858; }
.empty-icon { width: 48px; height: 48px; border-radius: 13px; background: #EDE0CC; display: flex; align-items: center; justify-content: center; }
.empty-title { font-size: 14px; font-weight: 500; color: #6B4A30; }

/* View Sale Item Modal */
.sale-view-card { border-radius: 16px !important; overflow: hidden; font-family: 'Outfit', sans-serif; background: #FDFAF6; }
.sv-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 16px 20px; background: #F5EFE4; border-bottom: 1px solid rgba(155,107,58,0.16); }
.sv-title { font-size: 15px; font-weight: 600; color: #3A2515; display: flex; align-items: center; }
.sv-sub { font-size: 12px; color: #9B6B3A; margin-top: 3px; padding-left: 24px; }
.sv-close { background: none; border: none; cursor: pointer; color: #9A7858; padding: 4px; border-radius: 6px; display: flex; align-items: center; transition: color 0.12s; }
.sv-close:hover { color: #B84040; }

.sv-body { padding: 16px 20px; max-height: 70vh; overflow-y: auto; }
.sv-divider { height: 1px; background: rgba(155,107,58,0.16); margin: 12px 0; }
.sv-section-title { font-size: 10px; font-weight: 600; letter-spacing: 0.13em; text-transform: uppercase; color: #9A7858; margin-bottom: 6px; }
.sv-section { margin-bottom: 4px; }
.sv-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; font-size: 13px; color: #3A2515; border-bottom: 1px solid rgba(155,107,58,0.08); }
.sv-row:last-child { border-bottom: none; }
.sv-lbl { color: #9A7858; font-size: 12px; flex-shrink: 0; }
.sv-val { font-weight: 500; text-align: right; }
.sv-discount { color: #B84040; }
.sv-total-row { display: flex; justify-content: space-between; align-items: baseline; padding: 10px 0 4px; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #3A2515; }
.sv-total-amt { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 600; color: #9B6B3A; }

/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(155,107,58,0.22); border-radius: 4px; }
</style>
