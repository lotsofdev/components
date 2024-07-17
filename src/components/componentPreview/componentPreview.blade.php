<article class="component-preview">
    @if ($component)
        <div class="component-preview_preview">
            <div class="component-preview_container">
                {!! $component->html !!}
            </div>
        </div>
        <div class="component-preview_component">
            <header class="component-preview_header">
                @if ($title)
                    <h2 class="typo-h2">{{ $title }}</h2>
                @endif
                @if ($description)
                    <p class="typo-format typo-rhythm">{{ $description }}</p>
                @endif
            </header>
            @include('propertiesPreview.propertiesPreview')
        </div>
    @endif
</article>