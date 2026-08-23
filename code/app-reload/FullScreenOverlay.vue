<template>
    <!-- z-[70] — above both toast (z-[60]) and modal-system's
         Dialog (z-50): a full-screen loading state needs to cover absolutely
         everything currently showing, not just sit alongside it. -->
    <div class="fixed inset-0 z-[70] flex items-center justify-center bg-white">
        <div class="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-800" />
    </div>
</template>
