/**
 * Feedback.jsx
 * ---------------------------------------------------------------------------
 * Componente reutilizável de feedback visual inline (erro / sucesso).
 *
 * Props:
 *   error   {string|null}  — mensagem de erro a exibir
 *   success {string|null}  — mensagem de sucesso a exibir
 *   className {string}     — classes extras (opcional)
 *
 * Uso:
 *   <Feedback error={error} success={success} />
 *
 * O componente retorna null quando ambas as props são falsy,
 * portanto pode ser declarado incondicionalmente no JSX.
 * ---------------------------------------------------------------------------
 */

import { motion, AnimatePresence } from 'framer-motion';

export default function Feedback({ error, success, className = '' }) {
  const message = error ?? success;
  const isError = Boolean(error);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message}
          initial={{ opacity: 0, y: -8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.2 }}
          className={[
            'flex items-start gap-3 rounded-xl border px-4 py-3 text-sm font-medium',
            isError
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-green-500/10 border-green-500/30 text-green-400',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          role="alert"
          aria-live="polite"
        >
          {/* Ícone */}
          {isError ? (
            <svg
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}

          {/* Mensagem */}
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
