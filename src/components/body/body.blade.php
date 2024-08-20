@if ($typoClasses)
    @php
        $bodyClasses = 'typo-rhythm typo-format';
        $suptitleClasses = 'typo-h' . $suptitleLevel;
        $titleClasses = 'typo-h' . $titleLevel;
        $subtitleClasses = 'typo-h' . $subtitleLevel;
        $leadClasses = 'typo-lead';
        $textClasses = 'typo-p';
    @endphp
@endif

<div class="body {{ $bodyClasses }}">

    @if ($suptitle !== '')
        <h{{ $suptitleLevel }} class="_suptitle {{ $suptitleClasses }}">{{ $suptitle }}</h{{ $suptitleLevel }}>
    @endif

    @if ($title !== '')
        <h{{ $titleLevel }} class="_title {{ $titleClasses }}">{{ $title }}</h{{ $titleLevel }}>
    @endif

    @if ($subtitle !== '')
        <h{{ $subtitleLevel }} class="_subtitle {{ $subtitleClasses }}">{{ $subtitle }}</h{{ $subtitleLevel }}>
    @endif

    @if ($lead !== '')
        <p class="_lead {{ $leadClasses }}">{{ $lead }}</p>
    @endif

    @if ($text !== null)
        <p class="_text {{ $textClasses }}</p>
    @endif

    @if (is_array($buttons) && count($buttons) > 0)
                <div class=" _buttons">
                @foreach ($buttons as $button)
                    @include ('button.button', (array) $button)
                @endforeach
        </div>
    @endif

</div>