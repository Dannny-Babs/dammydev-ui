import { useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import {
  Plus,
  X,
} from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Folder02Icon,TaskEdit01Icon,StickyNote02Icon,Medal02Icon, Flag02Icon, Calendar03Icon } from '@hugeicons/core-free-icons';
import styles from './MorphSurface.module.css';

export default function MorphSurface() {
  const [expanded, setExpanded] = useState(false);

  return (
    <LayoutGroup >
      <motion.div
        className={styles.container}
        layoutId="create-menu"
        initial={false}
        animate={{
          width: expanded ? 300 : 180,
          height: expanded ? 260 : 60,
          borderRadius: expanded ? 16 : 56
        }}
        transition={{ type: 'spring', stiffness:275, damping: 35 }}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Header */}
        <motion.div className={styles.header} layout="position">
          {expanded ? (
            <div className='flex items-center justify-between w-full'>
              <span className={styles.title}>Create New</span>
              <motion.div
                className={styles.closeIcon}
                layoutId="action-icon"
                onClick={e => {
                  e.stopPropagation();
                  setExpanded(false);
                }}
              >
                <X size={16} />
              </motion.div>
            </div>
          ) : (
            <div className='flex items-center justify-center w-full'>
              <motion.div className={styles.actionIcon} layoutId="action-icon">
                <Plus size={20} />
              </motion.div>
              <motion.span className={styles.title} layoutId="action-text">
                Create New
              </motion.span>
            </div>
          )}
        </motion.div>

        {/* Menu Items */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              className={styles.items}
              layout
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delayChildren: 0.2, staggerChildren: 0.05 }}
            >
              {[
                { icon: <HugeiconsIcon icon={Folder02Icon} size={24}  strokeWidth={1.5} />, label: 'Project' },
                { icon: <HugeiconsIcon icon={TaskEdit01Icon} size={24}  strokeWidth={1.5} />, label: 'Task' },
                { icon: <HugeiconsIcon icon={StickyNote02Icon} size={24}  strokeWidth={1.5} />, label: 'Note' },
                { icon: <HugeiconsIcon icon={Medal02Icon} size={24}  strokeWidth={1.5} />, label: 'Goal' },
                { icon: <HugeiconsIcon icon={Flag02Icon} size={24}  strokeWidth={1.5} />, label: 'Milestone' },
                { icon: <HugeiconsIcon icon={Calendar03Icon} size={24}  strokeWidth={1.5} />, label: 'Reminder' }
              ].map(item => (
                <motion.div
                  key={item.label}
                  className={styles.item}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => console.log(item.label)}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
}
