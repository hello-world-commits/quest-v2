/// <reference path="../pb_data/types.d.ts" />

// Validators (can_validate=true) should also be able to submit tasks so that
// they can test quest submissions from an admin account.  Any user that already
// has can_submit=true is left unchanged.
migrate((app) => {
  const result = app.db()
    .newQuery("UPDATE users SET can_submit = TRUE WHERE can_validate = TRUE AND can_submit = FALSE")
    .execute()
  console.log("[migration] enable_can_submit_for_validators: rows affected =", result?.rowsAffected?.() ?? 0)
}, (app) => {
  // Down: nothing to revert — we don't want to accidentally revoke permissions
  // that may have been set independently.
})
