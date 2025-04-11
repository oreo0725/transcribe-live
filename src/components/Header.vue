<template>
  <header class="header">
    <div class="container header-content">
      <div class="logo">
        <h1>TranscribeLive</h1>
        <div class="logo-accent"></div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  box-shadow: var(--shadow-subtle);
  position: relative;
  z-index: 10;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  height: 70px;
}

.logo {
  display: flex;
  flex-direction: column;
  position: relative;
}

.logo h1 {
  font-size: 1.6rem;
  font-weight: 600;
  letter-spacing: -0.5px;
  margin: 0;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.logo-accent {
  height: 4px;
  width: 40px;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  border-radius: 2px;
  margin-top: 2px;
}

@media (max-width: 768px) {
  .header-content {
    padding: var(--spacing-sm) var(--spacing-md);
    height: 60px;
  }
  
  .logo h1 {
    font-size: 1.4rem;
  }
  
  .logo-accent {
    width: 30px;
  }
}
</style>