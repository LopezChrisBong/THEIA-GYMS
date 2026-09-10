<template>
  <v-container fluid class="theia-view">
    <div class="page-header">
      <div>
        <div class="page-heading">Inventory Logs</div>
        <div class="page-sub">Track all inventory changes and movements</div>
      </div>
      <div class="header-actions">
        <div class="search-wrap">
          <v-icon size="14" color="#9A7858">mdi-magnify</v-icon>
          <input v-model="search" type="text" placeholder="Search logs..." class="search-input-proto" />
        </div>
      </div>
    </div>

    <div class="cust-table-card">
      <div class="filter-row">
        <button class="filter-chip" :class="{ on: filterAction === null }" @click="filterAction = null">All</button>
        <button class="filter-chip" :class="{ on: filterAction === 'add' }" @click="filterAction = 'add'">Add</button>
        <button class="filter-chip" :class="{ on: filterAction === 'edit' }" @click="filterAction = 'edit'">Edit</button>
        <button class="filter-chip" :class="{ on: filterAction === 'status_change' }" @click="filterAction = 'status_change'">Status Change</button>
        <button class="filter-chip" :class="{ on: filterAction === 'sale' }" @click="filterAction = 'sale'">Sale</button>
        <button class="filter-chip" :class="{ on: filterAction === 'transfer_out' }" @click="filterAction = 'transfer_out'">Transfer Out</button>
        <button class="filter-chip" :class="{ on: filterAction === 'transfer_in' }" @click="filterAction = 'transfer_in'">Transfer In</button>
        <button class="filter-chip" :class="{ on: filterAction === 'return' }" @click="filterAction = 'return'">Return</button>
        <div class="filter-spacer" />
      </div>

      <div class="tbl-wrap">
        <table class="cust-table" v-if="!loading">
          <thead>
            <tr>
              <th>ID</th>
              <th>Item</th>
              <th>Branch</th>
              <th>Action</th>
              <th>Status Change</th>
              <th>Reference</th>
              <th>By</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredData" :key="item.id">
              <td class="mono">{{ item.id }}</td>
              <td>
                <span v-if="item.jewelryItem">
                  <span class="mono">{{ item.jewelryItem.itemCode }}</span>
                  <span v-if="item.jewelryItem.name" class="dim" style="margin-left:6px">{{ item.jewelryItem.name }}</span>
                </span>
                <span v-else class="dim">—</span>
              </td>
              <td>
                <span v-if="item.branch" class="repeat-badge r-primary">{{ item.branch.branchName }}</span>
                <span v-else class="dim">—</span>
              </td>
              <td><span class="repeat-badge" :class="'r-action-' + item.actionType">{{ formatActionType(item.actionType) }}</span></td>
              <td class="dim">
                <span v-if="item.previousStatus || item.newStatus">{{ item.previousStatus || '—' }} → {{ item.newStatus || '—' }}</span>
                <span v-else>—</span>
              </td>
              <td>
                <span v-if="item.referenceType" class="cust-name">{{ item.referenceType }}</span>
                <span v-if="item.referenceId" class="dim"> #{{ item.referenceId }}</span>
                <span v-if="!item.referenceType && !item.referenceId" class="dim">—</span>
              </td>
              <td>
                <span v-if="item.performer">{{ item.performer.email }}</span>
                <span v-else class="dim">—</span>
              </td>
              <td class="dim">{{ formatDateTime(item.createdAt) }}</td>
              <td>
                <div class="act-btns">
                  <button class="act-btn view-btn" title="View" @click="viewItem(item)"><v-icon size="14">mdi-eye-outline</v-icon></button>
                </div>
              </td>
            </tr>
            <tr v-if="filteredData.length === 0">
              <td colspan="9">
                <div class="empty-state">
                  <div class="empty-icon"><v-icon size="20" color="#9B6B3A">mdi-clipboard-text-clock-outline</v-icon></div>
                  <div class="empty-title">No inventory logs found</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div v-if="loading" class="empty-state">
          <v-progress-circular indeterminate color="#9B6B3A" size="32" />
          <div class="empty-title">Loading logs...</div>
        </div>
      </div>
    </div>

    <!-- View Log Modal -->
    <v-dialog v-model="dialogView" max-width="480px">
      <v-card v-if="viewData" class="sale-view-card">
        <div class="sv-header">
          <div>
            <div class="sv-title">
              <v-icon size="16" color="#9B6B3A" style="margin-right:8px">mdi-clipboard-text-clock-outline</v-icon>
              Inventory Log Details
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
              <span class="sv-lbl">Item</span>
              <span class="sv-val">{{ viewData.jewelryItem?.name || viewData.jewelryItem?.itemCode || '—' }}</span>
            </div>
            <div class="sv-row">
              <span class="sv-lbl">Branch</span>
              <span class="sv-val">{{ viewData.branch?.branchName || '—' }}</span>
            </div>
            <div class="sv-row">
              <span class="sv-lbl">Action</span>
              <span class="sv-val">
                <span class="repeat-badge" :class="'r-action-' + viewData.actionType">{{ formatActionType(viewData.actionType) }}</span>
              </span>
            </div>
            <div class="sv-row" v-if="viewData.previousStatus || viewData.newStatus">
              <span class="sv-lbl">Status Change</span>
              <span class="sv-val">{{ viewData.previousStatus || '—' }} → {{ viewData.newStatus || '—' }}</span>
            </div>
            <div class="sv-row" v-if="viewData.referenceType || viewData.referenceId">
              <span class="sv-lbl">Reference</span>
              <span class="sv-val">{{ viewData.referenceType || '—' }}<template v-if="viewData.referenceId"> #{{ viewData.referenceId }}</template></span>
            </div>
            <div class="sv-row">
              <span class="sv-lbl">Performed By</span>
              <span class="sv-val">{{ viewData.performer?.email || '—' }}</span>
            </div>
            <div class="sv-row">
              <span class="sv-lbl">Date</span>
              <span class="sv-val">{{ formatDateTime(viewData.createdAt) }}</span>
            </div>
          </div>

          <template v-if="viewData.notes">
            <div class="sv-divider"></div>
            <div class="sv-section-title">Notes</div>
            <div class="sv-notes">{{ viewData.notes }}</div>
          </template>
        </div>
      </v-card>
    </v-dialog>

    <fade-away-message-component displayType="variation2" v-model="fadeAwayMessage.show" :message="fadeAwayMessage.message" :header="fadeAwayMessage.header" :top="fadeAwayMessage.top" :type="fadeAwayMessage.type" />
  </v-container>
</template>

<script>
export default {
  data: () => ({
    search: "", filterAction: null, data: [],
    loading: false, dialogView: false, viewData: null,
    fadeAwayMessage: { show: false, type: "success", header: "Success", message: "", top: 10 },
  }),
  computed: {
    filteredData() {
      let result = [...this.data];
      if (this.filterAction) result = result.filter((l) => l.actionType === this.filterAction);
      if (this.search) {
        const q = this.search.toLowerCase();
        result = result.filter((l) =>
          [l.jewelryItem?.itemCode, l.jewelryItem?.name, l.branch?.branchName, l.actionType, l.referenceType, l.performer?.email].filter(Boolean).some((f) => String(f).toLowerCase().includes(q))
        );
      }
      return result;
    },
  },
  mounted() {
    this.initialize();
  },
  methods: {
    formatDateTime(d) { if (!d) return "—"; return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }); },
    formatActionType(t) {
      const labels = { add: "Add", edit: "Edit", delete: "Delete", adjust: "Adjust", transfer_out: "Transfer Out", transfer_in: "Transfer In", sale: "Sale", return: "Return", status_change: "Status Change" };
      return labels[t] || t || "—";
    },
    initialize() {
      this.loading = true;
      this.axiosCall("/inventory-logs", "GET").then((r) => { if (r && r.data) this.data = r.data; })
        .catch(() => { this.fadeAwayMessage = { show: true, type: "error", header: "Error", message: "Failed to load logs", top: 10 }; })
        .finally(() => { this.loading = false; });
    },
    viewItem(item) { this.viewData = item; this.dialogView = true; },
  },
};
</script>

<style scoped>
.theia-view { font-family: 'Outfit', sans-serif; color: #3A2515; position: relative; z-index: 1; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 18px; }
.page-heading { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 500; color: #3A2515; }
.page-sub { font-size: 12px; color: #9A7858; margin-top: 2px; }
.header-actions { display: flex; align-items: center; gap: 10px; }
.search-wrap { display: flex; align-items: center; gap: 8px; background: #FDFAF6; border: 1px solid rgba(155,107,58,0.16); border-radius: 9px; padding: 8px 13px; box-shadow: 0 1px 6px rgba(80,30,10,0.08); min-width: 210px; }
.search-input-proto { border: none; background: none; outline: none; font-size: 13px; font-family: 'Outfit'; color: #3A2515; width: 100%; }
.search-input-proto::placeholder { color: #9A7858; }
.cust-table-card { background: #FDFAF6; border: 1px solid rgba(155,107,58,0.16); border-radius: 16px; box-shadow: 0 2px 14px rgba(80,30,10,0.08); overflow: hidden; }
.filter-row { display: flex; align-items: center; gap: 8px; padding: 12px 18px; border-bottom: 1px solid rgba(155,107,58,0.16); background: #F5EFE4; flex-wrap: wrap; }
.filter-chip { padding: 5px 12px; border-radius: 20px; font-size: 12px; border: 1px solid rgba(155,107,58,0.16); background: #FDFAF6; color: #9A7858; cursor: pointer; font-family: 'Outfit'; transition: all 0.12s; }
.filter-chip:hover { border-color: #C49455; color: #9B6B3A; }
.filter-chip.on { border-color: #9B6B3A; color: #9B6B3A; background: #EDE0CC; font-weight: 500; }
.filter-spacer { flex: 1; }
.tbl-wrap { overflow-x: auto; }
.cust-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 1000px; }
.cust-table thead th { text-align: left; padding: 10px 16px; font-size: 10px; letter-spacing: 0.13em; text-transform: uppercase; color: #9A7858; font-weight: 600; background: #F5EFE4; white-space: nowrap; }
.cust-table tbody tr { border-top: 1px solid rgba(155,107,58,0.16); transition: background 0.1s; }
.cust-table tbody tr:hover { background: #EDE0CC; }
.cust-table tbody td { padding: 11px 16px; color: #3A2515; white-space: nowrap; vertical-align: middle; }
td.mono { font-family: monospace; font-size: 12px; color: #9B6B3A; font-weight: 600; }
.dim { color: #9A7858; font-size: 12px; }
.cust-name { font-weight: 500; }
.repeat-badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; }
.r-primary { background: rgba(155,107,58,0.12); color: #9B6B3A; }
.r-action-add { background: rgba(61,122,90,0.1); color: #3D7A5A; }
.r-action-edit { background: rgba(90,122,155,0.1); color: #5A7A9B; }
.r-action-delete { background: rgba(184,64,64,0.08); color: #B84040; }
.r-action-adjust { background: rgba(155,107,58,0.1); color: #9B6B3A; }
.r-action-transfer_out { background: rgba(200,140,50,0.1); color: #C48C32; }
.r-action-transfer_in { background: rgba(0,150,136,0.1); color: #009688; }
.r-action-sale { background: rgba(155,107,58,0.15); color: #9B6B3A; }
.r-action-return { background: rgba(120,80,160,0.1); color: #7850A0; }
.r-action-status_change { background: rgba(90,122,155,0.12); color: #5A7A9B; }
.act-btns { display: flex; align-items: center; gap: 4px; }
.act-btn { width: 27px; height: 27px; border-radius: 7px; border: 1px solid rgba(155,107,58,0.16); background: #F5EFE4; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.12s; color: #9A7858; }
.act-btn.view-btn:hover { border-color: #5A7A9B; color: #5A7A9B; background: rgba(90,122,155,0.06); }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 52px 20px; gap: 10px; color: #9A7858; }
.empty-icon { width: 48px; height: 48px; border-radius: 13px; background: #EDE0CC; display: flex; align-items: center; justify-content: center; }
.empty-title { font-size: 14px; font-weight: 500; color: #6B4A30; }

/* View Log Modal */
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
.sv-notes { font-size: 13px; color: #6B4A30; background: rgba(155,107,58,0.06); border-radius: 8px; padding: 8px 12px; margin-bottom: 4px; line-height: 1.5; }
</style>
