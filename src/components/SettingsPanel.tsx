import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, Trash2, RotateCcw } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const { dispatch } = useApp();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <Settings className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              exit={{ y: 100 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-6 w-full max-w-sm space-y-4"
            >
              <h3 className="font-display font-bold text-lg">Settings</h3>

              <button
                onClick={() => {
                  dispatch({ type: "RESET_TOKENS" });
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-muted hover:bg-secondary transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Kiss Tokens
              </button>

              <button
                onClick={() => {
                  if (confirm("This will reset everything. Are you sure?")) {
                    dispatch({ type: "RESET_ALL" });
                    setOpen(false);
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Reset Everything
              </button>

              <button
                onClick={() => setOpen(false)}
                className="w-full py-3 text-sm text-muted-foreground"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
