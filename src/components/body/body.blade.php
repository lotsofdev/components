<div class="body typo-rhythm typo-format">

    @if ($suptitle !== null)
        <h{{ $suptitleLevel }} class="_suptitle typo-h{{ $suptitleLevel }}">{{ $suptitle }}</h{{ $suptitleLevel }}>
    @endif

    @if ($title !== null)
        <h{{ $titleLevel }} class="_title typo-h{{ $titleLevel }}">{{ $title }}</h{{ $titleLevel }}>
    @endif

    @if ($subtitle !== null)
        <h{{ $subtitleLevel }} class="_subtitle typo-h{{ $subtitleLevel }}">{{ $subtitle }}</h{{ $subtitleLevel }}>
    @endif

    @if ($lead !== null)
        <p class="_lead typo-lead">{{ $lead }}</p>
    @endif

    @if ($text !== null)
        <p class="_text typo-p">{{ $text }}</p>
    @endif

    @if (is_array($buttons) && count($buttons) > 0)
        <div class="_buttons">
            @foreach ($buttons as $button)
                {!! $button->html !!}
            @endforeach
        </div>
    @endif

</div>