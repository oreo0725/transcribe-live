<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <p class="copyright">&copy; 2025 LinguaLive<span class="version">v1.0</span></p>
        <div class="footer-links">
          <a href="#" title="用戶隱私">隱私政策</a>
          <a href="#" title="使用條款">使用條款</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--color-surface);
  color: var(--color-text-tertiary);
  border-top: 1px solid var(--color-divider);
  padding: var(--spacing-md) 0;
  margin-top: auto;
  font-size: 0.85rem;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.copyright {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.version {
  font-size: 0.75rem;
  margin-left: var(--spacing-sm);
  opacity: 0.7;
}

.footer-links {
  display: flex;
  gap: var(--spacing-md);
}

.footer-links a {
  color: var(--color-text-tertiary);
  text-decoration: none;
  transition: color var(--transition-fast) ease;
}

.footer-links a:hover {
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .footer-links {
    margin-top: var(--spacing-xs);
  }
}
</style>